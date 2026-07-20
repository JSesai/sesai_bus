import { ipcMain } from "electron";
import type { TicketPrintData } from "./printer.types.js";
import { generateTicketPdf } from "./ticket-formatter.js";

async function tryConnectPrinter(): Promise<boolean> {
  try {
    const escpos = await import("escpos");
    const USB = await import("escpos-usb");
    escpos.default.USB = USB.default;
    const devices = USB.default.findPrinter();
    if (devices && devices.length > 0) {
      return true;
    }
  } catch {
    // printer not available
  }
  return false;
}

async function printEscPos(ticketData: TicketPrintData): Promise<void> {
  const escpos = await import("escpos");
  const USB = await import("escpos-usb");
  escpos.default.USB = USB.default;

  return new Promise((resolve, reject) => {
    const device = new USB.default();
    const printer = new escpos.default.Printer(device);

    device.open((err: Error | null) => {
      if (err) {
        reject(err);
        return;
      }

      const separator = "================================";
      const thinSeparator = "--------------------------------";

      printer
        .align("center")
        .text(separator)
        .text(ticketData.agencyName)
        .text(`${ticketData.agencyCity} - Tel: ${ticketData.agencyPhone}`)
        .text(separator)
        .feed(1)
        .align("left")
        .text(`ORIGEN:     ${ticketData.origin}`)
        .text(`DESTINO:    ${ticketData.destination}`)
        .text(thinSeparator)
        .text(`FECHA:      ${ticketData.date}`)
        .text(`HORA:       ${ticketData.time}`);

      if (ticketData.isRoundTrip && ticketData.returnDate) {
        printer.text(`REGRESO:    ${ticketData.returnDate}`);
      }

      printer
        .text(thinSeparator)
        .text(`PASAJERO:   ${ticketData.passengerName}`)
        .text(`TELEFONO:   ${ticketData.passengerPhone}`)
        .text(thinSeparator)
        .text(`ASIENTOS:   ${ticketData.seatNumbers.join(", ")}`)
        .text(`CANTIDAD:   ${ticketData.seatNumbers.length}`)
        .feed(1)
        .align("center")
        .text(separator)
        .text(`TOTAL: $${ticketData.totalAmount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`)
        .text(separator)
        .feed(1)
        .text("Gracias por su compra")
        .text("Buen viaje!")
        .feed(3)
        .cut()
        .close(() => {
          resolve();
        });
    });
  });
}

export function registerPrinterHandlers(): void {
  ipcMain.handle("printer:print", async (_event, ticketData: TicketPrintData) => {
    try {
      const connected = await tryConnectPrinter();

      if (connected) {
        await printEscPos(ticketData);
        return { ok: true, method: "printer" as const };
      }

      const pdfBase64 = await generateTicketPdf(ticketData);
      return { ok: true, method: "pdf" as const, pdfData: pdfBase64 };
    } catch (error) {
      const pdfBase64 = await generateTicketPdf(ticketData);
      return { ok: true, method: "pdf" as const, pdfData: pdfBase64 };
    }
  });

  ipcMain.handle("printer:checkStatus", async () => {
    const connected = await tryConnectPrinter();
    return { connected };
  });
}
