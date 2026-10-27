import type { TicketPrintData } from "./printer.types.js";
import { generateTicketCode } from "../../../shared/utils/ticketCode.js";
// @ts-expect-error — qr-image has no type declarations
import qrImage from "qr-image";

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

export function formatTicketForEscPos(ticketData: TicketPrintData): string {
  const lines: string[] = [];
  const separator = "================================\n";
  const thinSeparator = "--------------------------------\n";

  lines.push("\n");
  lines.push(separator);
  lines.push(centerText(ticketData.agencyName));
  lines.push(centerText(`${ticketData.agencyCity} - Tel: ${ticketData.agencyPhone}`));
  lines.push(separator);

  const purchaseStr = formatPurchaseDate(ticketData.purchaseDate);
  if (purchaseStr) {
    lines.push(centerText(`Compra: ${purchaseStr}`));
    lines.push(thinSeparator);
  }

  lines.push("\n");

  lines.push(`ORIGEN:          ${ticketData.origin}\n`);
  lines.push(`DESTINO:         ${ticketData.destination}\n`);
  lines.push(thinSeparator);
  lines.push(`FECHA DE SALIDA: ${ticketData.date}\n`);
  lines.push(`HORA DE SALIDA:  ${ticketData.time}\n`);
  if (ticketData.isRoundTrip && ticketData.returnDate) {
    lines.push(`REGRESO:         ${ticketData.returnDate}\n`);
  }
  lines.push(thinSeparator);
  lines.push(`PASAJERO:        ${ticketData.passengerName}\n`);
  lines.push(thinSeparator);
  lines.push(`ASIENTOS:        ${ticketData.seatNumbers.join(", ")}\n`);
  lines.push(`CANTIDAD:        ${ticketData.seatNumbers.length}\n`);
  lines.push("\n");
  lines.push(separator);
  lines.push(centerText(`TOTAL: $${ticketData.totalAmount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`));
  lines.push(separator);
  lines.push("\n");
  lines.push(centerText("Gracias por su compra"));
  lines.push(centerText("Buen viaje!"));
  lines.push("\n\n\n");

  return lines.join("");
}

function centerText(text: string): string {
  const width = 32;
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  return " ".repeat(padding) + text + "\n";
}

export async function generateTicketPdf(ticketData: TicketPrintData): Promise<string> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [80, 210] });

  const centerX = 40;
  let y = 10;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(ticketData.agencyName, centerX, y, { align: "center" });
  y += 6;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`${ticketData.agencyCity} - Tel: ${ticketData.agencyPhone}`, centerX, y, { align: "center" });
  y += 5;

  const purchaseStr = formatPurchaseDate(ticketData.purchaseDate);
  if (purchaseStr) {
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    doc.text(`Compra: ${purchaseStr}`, centerX, y, { align: "center" });
    y += 4;
  }

  doc.setDrawColor(0);
  doc.line(5, y, 75, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("ORIGEN:", 7, y);
  doc.setFont("helvetica", "normal");
  doc.text(ticketData.origin, 30, y);
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.text("DESTINO:", 7, y);
  doc.setFont("helvetica", "normal");
  doc.text(ticketData.destination, 30, y);
  y += 6;

  doc.line(5, y, 75, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.text("FECHA SALIDA:", 7, y);
  doc.setFont("helvetica", "normal");
  doc.text(ticketData.date, 38, y);
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.text("HORA SALIDA:", 7, y);
  doc.setFont("helvetica", "normal");
  doc.text(ticketData.time, 38, y);
  y += 5;

  if (ticketData.isRoundTrip && ticketData.returnDate) {
    doc.setFont("helvetica", "bold");
    doc.text("REGRESO:", 7, y);
    doc.setFont("helvetica", "normal");
    doc.text(ticketData.returnDate, 30, y);
    y += 5;
  }

  doc.line(5, y, 75, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.text("PASAJERO:", 7, y);
  doc.setFont("helvetica", "normal");
  doc.text(ticketData.passengerName, 30, y);
  y += 6;

  doc.line(5, y, 75, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.text("ASIENTOS:", 7, y);
  doc.setFont("helvetica", "normal");
  doc.text(ticketData.seatNumbers.join(", "), 30, y);
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.text("CANTIDAD:", 7, y);
  doc.setFont("helvetica", "normal");
  doc.text(String(ticketData.seatNumbers.length), 30, y);
  y += 8;

  doc.setDrawColor(0);
  doc.line(5, y, 75, y);
  y += 7;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL: $${ticketData.totalAmount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`, centerX, y, { align: "center" });
  y += 6;

  doc.line(5, y, 75, y);
  y += 8;

  // QR Code
  const ticketCode = generateTicketCode({
    origin: ticketData.origin,
    destination: ticketData.destination,
    date: ticketData.date,
    time: ticketData.time,
    passengerName: ticketData.passengerName,
    seatNumbers: ticketData.seatNumbers,
    ticketIds: ticketData.ticketIds || [],
  });

  if (ticketCode) {
    const qrBuffer: Buffer = qrImage.imageSync(ticketCode, { type: "png", size: 4, margin: 1 });
    const qrBase64 = qrBuffer.toString("base64");
    const qrDataUri = `data:image/png;base64,${qrBase64}`;

    const qrSize = 28;
    const qrX = (80 - qrSize) / 2;
    doc.addImage(qrDataUri, "PNG", qrX, y, qrSize, qrSize);
    y += qrSize + 3;

    doc.setFontSize(8);
    doc.text("Presentar este codigo al abordar", centerX, y, { align: "center" });
    y += 6;
  } else {
    doc.setFontSize(8);
    doc.text("QR no disponible: boleto sin identificador", centerX, y, { align: "center" });
    y += 6;
  }

  doc.line(5, y, 75, y);
  y += 5;

  doc.setFontSize(8);
  doc.text("Gracias por su compra", centerX, y, { align: "center" });
  y += 4;
  doc.text("Buen viaje!", centerX, y, { align: "center" });

  const pdfBase64 = doc.output("datauristring");
  return pdfBase64;
}
