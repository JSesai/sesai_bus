import http from "http";
import { schedulesRepo } from "../../db/repositories/schedulesRepo.js";
import { getLocalIP } from "../../utils/network.js";
import { logger } from "../logger.js";
import { waitingRoomPageHtml } from "./waitingRoomPage.js";

const WAITING_ROOM_PORT = 8099;

let server: http.Server | null = null;

export function getWaitingRoomUrl(): { url: string; port: number } {
    return { url: `http://${getLocalIP()}:${WAITING_ROOM_PORT}`, port: WAITING_ROOM_PORT };
}

export function startWaitingRoomServer(): void {
    if (server) return;

    server = http.createServer((req, res) => {
        logger.debug("waiting-room", `→ ${req.method || "GET"} ${req.url}`);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
            res.writeHead(204);
            res.end();
            return;
        }

        if (req.url === "/api/departures") {
            schedulesRepo.getTodayDepartures().then(
                (rows) => {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ ok: true, data: rows || [] }));
                },
                (err) => {
                    logger.error("waiting-room", "Error en /api/departures", err);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ ok: false, error: String(err?.message || err) }));
                }
            );
            return;
        }

        if (req.url === "/") {
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(waitingRoomPageHtml);
            return;
        }

        res.writeHead(404);
        res.end("Not found");
    });

    server.listen(WAITING_ROOM_PORT, "0.0.0.0", () => {
        logger.info("waiting-room", `Servidor disponible en ${getWaitingRoomUrl().url}`);
        console.log(`\n  🖥️  Sala de Espera disponible en:`);
        console.log(`     ${getWaitingRoomUrl().url}`);
        console.log(`     (abre esta URL en cualquier navegador de la red local)\n`);
    });

    server.on("error", (err: any) => {
        if (err.code === "EADDRINUSE") {
            logger.warn("waiting-room", `Puerto ${WAITING_ROOM_PORT} en uso, servidor de sala de espera no iniciado`);
            console.log(`Puerto ${WAITING_ROOM_PORT} en uso, servidor de sala de espera no iniciado`);
        } else {
            logger.error("waiting-room", "Error en servidor de sala de espera", err);
            console.error("Error en servidor de sala de espera:", err);
        }
    });
}

export function stopWaitingRoomServer(): void {
    if (server) {
        server.close();
        server = null;
    }
}
