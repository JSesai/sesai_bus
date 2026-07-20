import type { TicketPrintData } from "./printer.types.js";

export function formatTicketForEscPos(ticketData: TicketPrintData): string {
  const lines: string[] = [];
  const separator = "================================\n";
  const thinSeparator = "--------------------------------\n";

  lines.push("\n");
  lines.push(separator);
  lines.push(centerText(ticketData.agencyName));
  lines.push(centerText(`${ticketData.agencyCity} - Tel: ${ticketData.agencyPhone}`));
  lines.push(separator);
  lines.push("\n");

  lines.push(`ORIGEN:     ${ticketData.origin}\n`);
  lines.push(`DESTINO:    ${ticketData.destination}\n`);
  lines.push(thinSeparator);
  lines.push(`FECHA:      ${ticketData.date}\n`);
  lines.push(`HORA:       ${ticketData.time}\n`);
  if (ticketData.isRoundTrip && ticketData.returnDate) {
    lines.push(`REGRESO:    ${ticketData.returnDate}\n`);
  }
  lines.push(thinSeparator);
  lines.push(`PASAJERO:   ${ticketData.passengerName}\n`);
  lines.push(`TELEFONO:   ${ticketData.passengerPhone}\n`);
  lines.push(thinSeparator);
  lines.push(`ASIENTOS:   ${ticketData.seatNumbers.join(", ")}\n`);
  lines.push(`CANTIDAD:   ${ticketData.seatNumbers.length}\n`);
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
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [80, 180] });

  const centerX = 40;
  let y = 10;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(ticketData.agencyName, centerX, y, { align: "center" });
  y += 6;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`${ticketData.agencyCity} - Tel: ${ticketData.agencyPhone}`, centerX, y, { align: "center" });
  y += 8;

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
  doc.text("FECHA:", 7, y);
  doc.setFont("helvetica", "normal");
  doc.text(ticketData.date, 30, y);
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.text("HORA:", 7, y);
  doc.setFont("helvetica", "normal");
  doc.text(ticketData.time, 30, y);
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
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.text("TELEFONO:", 7, y);
  doc.setFont("helvetica", "normal");
  doc.text(ticketData.passengerPhone, 30, y);
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
  y += 7;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Gracias por su compra", centerX, y, { align: "center" });
  y += 4;
  doc.text("Buen viaje!", centerX, y, { align: "center" });

  const pdfBase64 = doc.output("datauristring");
  return pdfBase64;
}
