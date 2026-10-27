import { ipcMain } from "electron";
import type { TicketPrintData } from "./printer.types.js";
import { generateTicketPdf } from "./ticket-formatter.js";
import { generateTicketCode } from "../../../shared/utils/ticketCode.js";
import usb, { type UsbDevice } from "usb";
import { appConfigRepo } from "../../db/repositories/appConfigRepo.js";

const PRINT_TIMEOUT_MS = 30000;
const PRINTER_USB_CLASS = 0x07;

interface PrinterSettings {
  textSize: 1 | 2 | 3;
  qrSize: number;
  cutEnabled: boolean;
  cutMode: 1 | 2 | 3;
}

const DEFAULT_PRINTER_SETTINGS: PrinterSettings = {
  textSize: 1,
  qrSize: 4,
  cutEnabled: true,
  cutMode: 1,
};

type PrinterConfigRow = {
  printer_text_size?: number | null;
  printer_qr_size?: number | null;
  printer_cut_enabled?: number | null;
  printer_cut_mode?: number | null;
};

async function getPrinterSettings(): Promise<PrinterSettings> {
  try {
    const config = (await appConfigRepo.getConfig()) as PrinterConfigRow | null | undefined;
    const textSize = [1, 2, 3].includes(Number(config?.printer_text_size))
      ? (Number(config?.printer_text_size) as PrinterSettings["textSize"])
      : DEFAULT_PRINTER_SETTINGS.textSize;
    const qrSize = Math.min(8, Math.max(2, Number(config?.printer_qr_size) || DEFAULT_PRINTER_SETTINGS.qrSize));
    const cutMode = [1, 2, 3].includes(Number(config?.printer_cut_mode))
      ? (Number(config?.printer_cut_mode) as PrinterSettings["cutMode"])
      : DEFAULT_PRINTER_SETTINGS.cutMode;
    const cutEnabled = Number(config?.printer_cut_enabled) !== 0;

    return { textSize, qrSize, cutEnabled, cutMode };
  } catch (error) {
    console.error("[Printer] Error leyendo configuración, usando valores por defecto:", error);
    return { ...DEFAULT_PRINTER_SETTINGS };
  }
}

function findPrinterDevice(): UsbDevice | null {
  try {
    return (
      usb
        .getDeviceList()
        .find((device) => {
          try {
            return device.configDescriptor.interfaces.some((ifaces) =>
              ifaces.some((conf) => conf.bInterfaceClass === PRINTER_USB_CLASS)
            );
          } catch {
            return false;
          }
        }) ?? null
    );
  } catch (error) {
    console.error("[Printer] Error listando dispositivos USB:", error);
    return null;
  }
}

function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u2014|\u2013/g, "-")
    .replace(/[^\u0020-\u007E]/g, "");
}

/**
 * `GS ! n` modos de impresión ESC/POS:
 *  0x00 = fuente A normal
 *  0x08 = enfatizado (negrita)
 *  0x10 = doble altura
 *  0x30 = enfatizado + doble altura + doble ancho (2x2)
 */
function printModeCommands(size: PrinterSettings["textSize"]): { body: Buffer; header: Buffer } {
  switch (size) {
    case 3:
      return { body: Buffer.from("\x1d!\x10", "latin1"), header: Buffer.from("\x1d!\x30", "latin1") };
    case 2:
      return { body: Buffer.from("\x1d!\x00", "latin1"), header: Buffer.from("\x1d!\x30", "latin1") };
    default:
      return { body: Buffer.from("\x1d!\x00", "latin1"), header: Buffer.from("\x1d!\x08", "latin1") };
  }
}

function buildCutCommand(settings: PrinterSettings): Buffer {
  if (!settings.cutEnabled) return Buffer.alloc(0);
  const feed = Buffer.from("\x1bd\x04", "latin1");
  let cut: Buffer;
  switch (settings.cutMode) {
    case 2:
      cut = Buffer.from("\x1dVB", "latin1"); // corte parcial
      break;
    case 3:
      cut = Buffer.from("\x1dV\x30", "latin1"); // variante genérica
      break;
    default:
      cut = Buffer.from("\x1dVA", "latin1"); // corte completo (default)
      break;
  }
  return Buffer.concat([feed, cut]);
}

function buildQrCommand(data: string, moduleSize: number): Buffer {
  const modelCmd = Buffer.from([0x1d, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00]);
  const moduleCmd = Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, moduleSize]);
  const errorCmd = Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, 0x30]);
  const dataBuffer = Buffer.from(data, "utf8");
  const storeLen = dataBuffer.length + 3;
  const storeCmd = Buffer.concat([
    Buffer.from([0x1d, 0x28, 0x6b, storeLen & 0xff, (storeLen >> 8) & 0xff, 0x31, 0x50, 0x30]),
    dataBuffer,
  ]);
  const printCmd = Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x51, 0x30]);
  return Buffer.concat([modelCmd, moduleCmd, errorCmd, storeCmd, printCmd]);
}

function formatPurchaseDate(isoDate?: string): string {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function buildTicketBuffer(ticketData: TicketPrintData, settings: PrinterSettings): Buffer {
  const esc = (code: string) => Buffer.from(code, "latin1");
  const init = esc("\x1b@");
  const alignCenter = esc("\x1ba\x01");
  const alignLeft = esc("\x1ba\x00");
  const feed1 = esc("\x1bd\x01");
  const feed3 = esc("\x1bd\x03");
  const modes = printModeCommands(settings.textSize);

  const lineText = (text: string) => `${normalizeText(text)}\n`;
  const separator = "================================\n";
  const thinSeparator = "--------------------------------\n";
  const total = `$${ticketData.totalAmount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
  const purchaseStr = formatPurchaseDate(ticketData.purchaseDate);

  const ticketCode = generateTicketCode({
    origin: ticketData.origin,
    destination: ticketData.destination,
    date: ticketData.date,
    time: ticketData.time,
    passengerName: ticketData.passengerName,
    seatNumbers: ticketData.seatNumbers,
    ticketIds: ticketData.ticketIds || [],
  });

  const parts: Uint8Array[] = [
    init,
    alignCenter,
    modes.header,
    Buffer.from(separator, "latin1"),
    Buffer.from(lineText(ticketData.agencyName), "latin1"),
    modes.body,
    Buffer.from(lineText(`${ticketData.agencyCity} - Tel: ${ticketData.agencyPhone}`), "latin1"),
  ];

  if (purchaseStr) {
    parts.push(Buffer.from(lineText(`Compra: ${purchaseStr}`), "latin1"));
  }

  parts.push(
    Buffer.from(thinSeparator, "latin1"),
    alignLeft,
    Buffer.from(lineText(`ORIGEN:   ${ticketData.origin}`), "latin1"),
    Buffer.from(lineText(`DESTINO:  ${ticketData.destination}`), "latin1"),
    Buffer.from(thinSeparator, "latin1"),
    Buffer.from(lineText(`FECHA SALIDA:  ${ticketData.date}`), "latin1"),
    Buffer.from(lineText(`HORA SALIDA:   ${ticketData.time}`), "latin1")
  );

  if (ticketData.isRoundTrip && ticketData.returnDate) {
    parts.push(Buffer.from(lineText(`REGRESO:       ${ticketData.returnDate}`), "latin1"));
  }

  parts.push(
    Buffer.from(thinSeparator, "latin1"),
    Buffer.from(lineText(`PASAJERO:  ${ticketData.passengerName}`), "latin1"),
    Buffer.from(thinSeparator, "latin1"),
    Buffer.from(lineText(`ASIENTOS:  ${ticketData.seatNumbers.join(", ")}`), "latin1"),
    Buffer.from(lineText(`CANTIDAD:  ${ticketData.seatNumbers.length}`), "latin1"),
    Buffer.from(thinSeparator, "latin1"),
    alignCenter,
    modes.header,
    Buffer.from(lineText(`TOTAL: ${total}`), "latin1"),
    modes.body,
    Buffer.from(thinSeparator, "latin1"),
    feed1,
    alignCenter
  );

  if (ticketCode) {
    parts.push(
      buildQrCommand(ticketCode, settings.qrSize),
      Buffer.from(lineText("  Presentar este codigo al abordar"), "latin1")
    );
  } else {
    parts.push(
      Buffer.from(lineText("QR no disponible: boleto sin identificador"), "latin1")
    );
  }

  parts.push(
    Buffer.from(thinSeparator, "latin1"),
    alignLeft,
    esc("\x1b@"), // reset text size antes del cierre
    Buffer.from(lineText("Gracias por su compra"), "latin1"),
    Buffer.from(lineText("Buen viaje!"), "latin1"),
    feed3,
    buildCutCommand(settings)
  );

  return Buffer.concat(parts);
}

async function printEscPos(ticketData: TicketPrintData, settings: PrinterSettings): Promise<void> {
  return new Promise((resolve, reject) => {
    let device: UsbDevice | null = null;

    try {
      device = findPrinterDevice();
      if (!device) {
        reject(new Error("No se encontró impresora USB conectada"));
        return;
      }

      const printerIfaceIdx = device.configDescriptor.interfaces.findIndex((ifaces) =>
        ifaces.some((conf) => conf.bInterfaceClass === PRINTER_USB_CLASS)
      );

      device.open();

      const printerIface = device.interfaces[printerIfaceIdx];
      if (!printerIface) {
        reject(new Error("No se encontró la interfaz de impresión"));
        return;
      }

      printerIface.claim();
      const outEndpoint = printerIface.endpoints.find((endpoint) => endpoint.direction === "out");
      if (!outEndpoint) {
        reject(new Error("No se encontró el endpoint de salida"));
        return;
      }

      const data = buildTicketBuffer(ticketData, settings);
      console.log(
        `[Printer] Enviando ticket a impresora (${data.length} bytes): ` +
          `${ticketData.origin} -> ${ticketData.destination} | ` +
          `texto=${settings.textSize} qr=${settings.qrSize} corte=${settings.cutEnabled ? "on(" + settings.cutMode + ")" : "off"}`
      );

      const transferTimer = setTimeout(() => {
        reject(new Error("Tiempo de espera agotado enviando a la impresora"));
      }, PRINT_TIMEOUT_MS);

      outEndpoint.transfer(data, (err: Error | null) => {
        clearTimeout(transferTimer);

        if (err) {
          console.error("[Printer] Error al enviar a la impresora:", err.message);
          reject(err);
          return;
        }

        console.log("[Printer] Ticket enviado correctamente a la impresora");
        try {
          printerIface.release(true, () => {
            setTimeout(() => {
              try {
                device?.close();
              } catch (closeErr) {
                console.error("[Printer] Error cerrando dispositivo:", closeErr);
              }
              resolve();
            }, 200);
          });
        } catch {
          try {
            device?.close();
          } catch {
            // ignore close errors
          }
          resolve();
        }
      });
    } catch (error) {
      try {
        device?.close();
      } catch {
        // ignore close errors
      }
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  });
}

async function tryConnectPrinter(): Promise<boolean> {
  const device = findPrinterDevice();
  console.log("[Printer] Impresora USB detectada:", device ? "SÍ" : "NO");
  return device !== null;
}

export function registerPrinterHandlers(): void {
  ipcMain.handle("printer:print", async (_event, ticketData: TicketPrintData) => {
    try {
      const connected = await tryConnectPrinter();

      if (connected) {
        console.log("[Printer] Conectando a la impresora...");
        const settings = await getPrinterSettings();
        await printEscPos(ticketData, settings);
        return { ok: true, method: "printer" as const };
      }

      console.log("[Printer] No se detectó impresora USB, generando PDF...");
      const pdfBase64 = await generateTicketPdf(ticketData);
      return { ok: true, method: "pdf" as const, pdfData: pdfBase64 };
    } catch (error) {
      console.error("[Printer] Error al imprimir:", error);
      const pdfBase64 = await generateTicketPdf(ticketData);
      return { ok: true, method: "pdf" as const, pdfData: pdfBase64 };
    }
  });

  ipcMain.handle("printer:checkStatus", async () => {
    const connected = await tryConnectPrinter();
    return { connected };
  });
}