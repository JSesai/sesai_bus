import { useTicket } from "../../auth/context/TicketContext"

export function SeatLegend() {
    const { seatColors } = useTicket();
    const { available, occupied, selected, reserved } = seatColors;
    return (
        <div className="w-full flex items-center justify-center gap-5 p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-md ${available} border-2 border-border`} />
                <span className="text-xs text-foreground">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-md ${selected} border-2 border-primary`} />
                <span className="text-xs text-foreground">Seleccionado</span>
            </div>
            <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-md ${occupied} border-2 border-border opacity-60 `} />
                <span className="text-xs text-foreground">Ocupado</span>
            </div>
        </div>
    )
}
