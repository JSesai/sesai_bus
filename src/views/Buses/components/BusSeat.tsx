

import { cn } from "../../lib/utils"

export type SeatStatus = "available" | "selected" | "occupied"

interface BusSeatProps {
    seatNumber: number
    status: SeatStatus
    onSelect: (seatNumber: number) => void
    disabled?: boolean
}

export function BusSeat({ seatNumber, status, onSelect, disabled }: BusSeatProps) {
    const isClickable = status !== "occupied" && !disabled

    return (
        <button
            type="button"
            onClick={() => isClickable && onSelect(seatNumber)}
            disabled={!isClickable}
            className={cn(
                "relative w-10 h-12 rounded-lg border-2 transition-all duration-200 flex items-center justify-center text-sm font-medium",
                status === "available" && "bg-seat-available border-border hover:bg-seat-available-hover hover:border-primary/50 cursor-pointer text-foreground",
                status === "selected" && "bg-primary border-primary text-primary-foreground shadow-md scale-105",
                status === "occupied" && "bg-seat-occupied border-seat-occupied text-muted-foreground cursor-not-allowed opacity-60"
            )}
            aria-label={`Asiento ${seatNumber} - ${status === "available" ? "Disponible" : status === "selected" ? "Seleccionado" : "Ocupado"}`}
        >
            <span className="relative z-10">{seatNumber}</span>
            {/* Seat back design */}
            <div className={cn(
                "absolute top-0 left-1 right-1 h-2 rounded-t-md -translate-y-1",
                status === "available" && "bg-seat-available border border-border",
                status === "selected" && "bg-primary border border-primary",
                status === "occupied" && "bg-seat-occupied border border-seat-occupied opacity-60"
            )} />
        </button>
    )
}
