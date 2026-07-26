interface TicketCodeData {
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengerName: string;
  seatNumbers: number[];
}

export function generateTicketCode(ticket: TicketCodeData): string {
  const payload = [
    ticket.origin,
    ticket.destination,
    ticket.date,
    ticket.time,
    ticket.passengerName,
    ticket.seatNumbers.sort((a, b) => a - b).join("-"),
  ].join("|");

  return btoa(encodeURIComponent(payload)).replace(/=/g, "");
}
