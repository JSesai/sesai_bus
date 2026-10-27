import { app } from "electron";
import https from "https";
import type { IncomingMessage, ServerResponse } from "http";
import path from "path";
import fs from "fs";
import { createRequire } from "module";
import { generate as generateSelfsignedCert } from "selfsigned";
import { boardingRepo } from "../../db/repositories/boardingRepo.js";
import { decodeTicketCode } from "../../../shared/utils/ticketCode.js";
import { getBoardingPin } from "./boardingConfig.js";
import { boardingPageHtml } from "./boarding-page.js";
import { logger } from "../logger.js";
import { getLocalIP } from "../../utils/network.js";
import { BoardingError } from "../../../shared/errors/customError.js";

const require = createRequire(import.meta.url);

const BOARDING_PORT = 8098;

let server: https.Server | null = null;

function getCertPath(): string {
    return path.join(app.getPath('userData'), 'boarding-cert.json');
}

async function getCert(): Promise<{ cert: string; private: string }> {
    const certPath = getCertPath();
    try {
        const cached = JSON.parse(fs.readFileSync(certPath, 'utf8'));
        if (cached && cached.cert && cached.private) {
            return { cert: cached.cert, private: cached.private };
        }
    } catch {
        // generar uno nuevo
    }

    const pems = await generateSelfsignedCert(
        [{ name: 'commonName', value: 'taquilla-sesai.local' }],
        {
            keySize: 2048,
            algorithm: 'sha256',
            notBeforeDate: new Date(),
            notAfterDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        }
    );
    const data = { cert: pems.cert, private: pems.private };
    try {
        fs.writeFileSync(certPath, JSON.stringify(data), 'utf8');
    } catch (err) {
        console.error('Error guardando certificado de abordaje:', err);
    }
    return data;
}

function sendJson(res: ServerResponse, status: number, payload: any): void {
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    });
    res.end(JSON.stringify(payload));
}

function parseBody(req: IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk: Buffer) => {
            body += chunk;
            if (body.length > 1e6) {
                req.destroy();
                reject(new Error('Body demasiado grande'));
            }
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                reject(e);
            }
        });
        req.on('error', reject);
    });
}

async function requirePin(pin: string, res: ServerResponse): Promise<boolean> {
    const expected = await getBoardingPin();
    const valid = expected === pin;
    if (!valid) {
        logger.warn("boarding", "PIN rechazado", { provided: pin, expected });
        sendJson(res, 401, {
            ok: false,
            data: null,
            error: { message: 'PIN incorrecto', detail: 'El PIN de acceso no es válido' },
        });
    }
    return valid;
}

export async function startBoardingServer(): Promise<void> {
    if (server) return;

    const { cert, private: privateKey } = await getCert();

    server = https.createServer({ cert, key: privateKey }, async (req, res) => {
        const started = Date.now();
        let url: URL;
        try {
            url = new URL(req.url || '/', `https://${req.headers.host || 'localhost'}`);
        } catch {
            logger.warn("boarding", `URL inválida: ${req.url}`);
            sendJson(res, 400, { ok: false, data: null, error: { message: 'URL inválida', detail: '' } });
            return;
        }

        const pathname = url.pathname;
        res.on('finish', () => {
            logger.debug("boarding", `${req.method || 'GET'} ${pathname} → ${res.statusCode} (${Date.now() - started}ms)`);
        });

        try {
            // Página de abordaje
            if (req.method === 'GET' && pathname === '/') {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(boardingPageHtml);
                return;
            }

            // Librería jsQR para decodificar QR en iOS Safari
            if (req.method === 'GET' && pathname === '/jsqr.js') {
                const jsqrPath = require.resolve('jsqr/dist/jsQR.js');
                const content = fs.readFileSync(jsqrPath);
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(content);
                return;
            }

            if (req.method === 'OPTIONS') {
                sendJson(res, 204, { ok: true, data: null, error: null });
                return;
            }

            if (!pathname.startsWith('/api/boarding')) {
                res.writeHead(404);
                res.end('Not found');
                return;
            }

            // El PIN viaja en el query para GET y en el body para POST
            let pin = '';
            let body: any = null;
            if (req.method === 'POST') {
                body = await parseBody(req);
                pin = String(body.pin || '');
            } else {
                pin = url.searchParams.get('pin') || '';
            }

            if (!(await requirePin(pin, res))) return;

            if (req.method === 'GET' && pathname === '/api/boarding/check-pin') {
                sendJson(res, 200, { ok: true, data: { valid: true }, error: null });
                return;
            }

            if (req.method === 'GET' && pathname === '/api/boarding/departures') {
                const date = url.searchParams.get('date') || '';
                const rows = await boardingRepo.getDeparturesByDate(date);
                sendJson(res, 200, { ok: true, data: rows, error: null });
                return;
            }

            if (req.method === 'GET' && pathname === '/api/boarding/manifest') {
                const scheduleId = parseInt(url.searchParams.get('scheduleId') || '0', 10);
                const rows = await boardingRepo.getBoardingManifest(scheduleId);
                sendJson(res, 200, { ok: true, data: rows, error: null });
                return;
            }

            if (req.method === 'POST') {
                if (pathname === '/api/boarding/identify') {
                    const decoded = decodeTicketCode(String(body.code || ''));
                    console.log('decoded', decoded);

                    if (!decoded || decoded.ticketIds.length === 0) {
                        logger.warn("boarding", "Código no reconocido en identify");
                        sendJson(res, 400, { ok: false, data: null, error: { message: 'Código no reconocido', detail: 'El QR no es un boleto válido' } });
                        return;
                    }
                    const tickets = await boardingRepo.getTicketsByIds(decoded.ticketIds);
                    logger.info("boarding", `identify ok: ${decoded.ticketIds.length} boletos`);
                    sendJson(res, 200, { ok: true, data: tickets, error: null });
                    return;
                }

                if (pathname === '/api/boarding/mark') {
                    const ticketIds = Array.isArray(body.ticketIds) ? body.ticketIds : [];
                    const changes = await boardingRepo.markBoarded(ticketIds, 0);
                    logger.info("boarding", `mark ok: ${changes} boletos abordados`);
                    sendJson(res, 200, { ok: true, data: { changes }, error: null });
                    return;
                }

                if (pathname === '/api/boarding/unmark') {
                    const ticketIds = Array.isArray(body.ticketIds) ? body.ticketIds : [];
                    const changes = await boardingRepo.unmarkBoarded(ticketIds);
                    logger.info("boarding", `unmark ok: ${changes} boletos revertidos`);
                    sendJson(res, 200, { ok: true, data: { changes }, error: null });
                    return;
                }
            }

            res.writeHead(404);
            res.end('Not found');
        } catch (error) {
            if (error instanceof BoardingError) {
                logger.warn("boarding", "Abordaje rechazado", error.details);
                sendJson(res, 400, {
                    ok: false,
                    data: null,
                    error: { message: error.message, detail: error.details || error.message },
                });
                return;
            }
            logger.error("boarding", `${req.method || 'GET'} ${pathname} → error`, error);
            console.error('Error en servidor de abordaje:', error);
            sendJson(res, 500, { ok: false, data: null, error: { message: 'Error interno', detail: String(error) } });
        }
    });

    server.on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
            logger.warn("boarding", `Puerto ${BOARDING_PORT} en uso, servidor de abordaje no iniciado`);
            console.log(`Puerto ${BOARDING_PORT} en uso, servidor de abordaje no iniciado`);
        } else {
            logger.error("boarding", "Error en servidor de abordaje", err);
            console.error('Error en servidor de abordaje:', err);
        }
    });

    await new Promise<void>((resolve) => server!.listen(BOARDING_PORT, '0.0.0.0', () => resolve()));

    const pin = await getBoardingPin();
    logger.info("boarding", `Servidor HTTPS disponible en https://${getLocalIP()}:${BOARDING_PORT}`);

    console.log(`\n  🎫  Abordaje desde el teléfono disponible en:`);
    console.log(`     https://${getLocalIP()}:${BOARDING_PORT}`);
    console.log(`     PIN: ${pin}`);
    console.log(`     (el teléfono debe estar en la misma red Wi-Fi)\n`);
}

export function stopBoardingServer(): void {
    logger.info("boarding", "Deteniendo servidor de abordaje");
    if (server) {
        server.close();
        server = null;
    }
}

export function getBoardingServerInfo(): { url: string; port: number } {
    return { url: `https://${getLocalIP()}:${BOARDING_PORT}`, port: BOARDING_PORT };
}
