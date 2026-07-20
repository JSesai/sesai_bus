export interface TicketPrintData {
  agencyName: string;
  agencyCity: string;
  agencyPhone: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengerName: string;
  passengerPhone: string;
  seatNumbers: number[];
  totalAmount: number;
  isRoundTrip: boolean;
  returnDate?: string;
  ticketId?: string;
}
