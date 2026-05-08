
import { useTicket } from "../../auth/context/TicketContext"
import { BusSeat, type SeatStatus } from "../components/BusSeat"
import { User } from "lucide-react"

// export interface SeatData {
//     seat_number: number
//     status: SeatStatus
// }

interface BusLayoutProps {
    seats: SeatData[]
    seatsPerRow: number
    onSeatSelect: (seatId: number) => void
}

export function BusLayout({ seats, seatsPerRow, onSeatSelect }: BusLayoutProps) {

    let leftSeats: number;
    let rightSeats: number;

    if (seatsPerRow === 3) {
        leftSeats = 2;
        rightSeats = 1;
    } else {
        leftSeats = Math.floor(seatsPerRow / 2);
        rightSeats = seatsPerRow - leftSeats;
    }
    // Group seats into rows
    const rows: SeatData[][] = []
    for (let i = 0; i < seats.length; i += seatsPerRow) {
        rows.push(seats.slice(i, i + seatsPerRow))
    }

    return (
        <div className="bg-card rounded-2xl border-2 border-border p-6 shadow-lg">
            {/* Driver area */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-dashed border-border">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Conductor</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                    <span className="text-xs text-muted-foreground">Frente</span>
                </div>
            </div>

            {/* Seat grid */}
            <div className="space-y-3">
                {rows.map((row, rowIndex) => {
                    const leftSideSeats = row.slice(0, leftSeats)
                    const rightSideSeats = row.slice(leftSeats, leftSeats + rightSeats)

                    return (
                        <div key={rowIndex} className="flex items-center justify-center gap-6">
                            {/* Left side seats */}
                            <div className="flex gap-2">
                                {leftSideSeats.map((seat) => (
                                    <BusSeat
                                        key={seat.seat_number}
                                        seatNumber={seat.seat_number}
                                        status={seat.status}
                                        onSelect={onSeatSelect}
                                    />
                                ))}
                            </div>

                            {/* Aisle indicator */}
                            <div className="w-8 flex flex-col items-center justify-center">
                                <div className="text-xs text-muted-foreground font-medium">
                                    {rowIndex + 1}
                                </div>
                            </div>

                            {/* Right side seats */}
                            <div className="flex gap-2">
                                {rightSideSeats.map((seat) => (
                                    <BusSeat
                                        key={seat.seat_number}
                                        seatNumber={seat.seat_number}
                                        status={seat.status}
                                        onSelect={onSeatSelect}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Back of bus indicator */}
            <div className="mt-6 pt-4 border-t-2 border-dashed border-border">
                <div className="text-center text-xs text-muted-foreground">Parte trasera</div>
            </div>
        </div>
    )
}
