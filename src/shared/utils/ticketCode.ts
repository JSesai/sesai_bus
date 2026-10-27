interface TicketCodeData {
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengerName: string;
  seatNumbers: number[];
  ticketIds: number[];
}

export function generateTicketCode(ticket: TicketCodeData): string {
  if (!ticket.ticketIds || ticket.ticketIds.length === 0) {
    console.warn("[ticketCode] No se generó el QR: el boleto no tiene ticketIds.");
    return "";
  }

  const payload = [
    ticket.origin,
    ticket.destination,
    ticket.date,
    ticket.time,
    ticket.passengerName,
    [...ticket.seatNumbers].sort((a, b) => a - b).join("-"),
    [...ticket.ticketIds].sort((a, b) => a - b).join(","),
  ].join("|");

  return btoa(encodeURIComponent(payload)).replace(/=/g, "");
}

export function decodeTicketCode(code: string): TicketCodeData | null {
  try {
    const padded = code.replace(/=+$/, "").padEnd(Math.ceil(code.replace(/=+$/, "").length / 4) * 4, "=");
    const decoded = decodeURIComponent(atob(padded));

    const parts = decoded.split("|");
    if (parts.length !== 7) {
      console.warn(
        parts.length === 6
          ? "[ticketCode] QR con formato viejo (6 campos); reimprima el boleto."
          : `[ticketCode] QR con formato no soportado (${parts.length} campos).`
      );
      return null;
    }

    const seatNumbers = parts[5]
      .split("-")
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => !isNaN(n));

    const ticketIds = parts[6]
      .split(",")
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => !isNaN(n));

    if (seatNumbers.length === 0) return null;

    if (ticketIds.length === 0) {
      console.warn("[ticketCode] QR sin ticketIds; reimprima el boleto.", decoded);
      return null;
    }

    return {
      origin: parts[0],
      destination: parts[1],
      date: parts[2],
      time: parts[3],
      passengerName: parts[4],
      seatNumbers,
      ticketIds,
    };
  } catch {
    return null;
  }
}
