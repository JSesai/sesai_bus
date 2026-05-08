export function SeatLegend() {
    return (
        <div className="w-full flex items-center justify-center gap-5 p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md bg-seat-available border-2 border-border" />
                <span className="text-xs text-foreground">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md bg-primary border-2 border-primary" />
                <span className="text-xs text-foreground">Seleccionado</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md bg-seat-occupied border-2 border-seat-occupied opacity-60" />
                <span className="text-xs text-foreground">Ocupado</span>
            </div>
        </div>
    )
}
