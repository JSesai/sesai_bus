import { Button } from "../../components/ui/button"
import { Ticket, CreditCard, MapPin, Calendar, Clock } from "lucide-react"

interface OrderSummaryProps {
    selectedSeats: number[];
    pricePerSeat: number;
    onContinue: () => void;
    disabledContinue?: boolean;
    tripInfo: {
        origin: string;
        destination: string;
        date: string;
        time: string;
        pasengers: number;
        accionBtn: string;
    }
}

export function OrderSummary({ onContinue, selectedSeats, pricePerSeat, tripInfo, disabledContinue = false }: OrderSummaryProps) {
    const total = selectedSeats.length * pricePerSeat

    return (
        <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <div className="flex items-center gap-2 text-foreground">
                <Ticket className="w-5 h-5" />
                <h3 className="font-semibold">Resumen del Pedido</h3>
            </div>

            {/* Trip info */}
            <div className="space-y-3 pb-4 border-b border-border">
                <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                        <p className="text-muted-foreground">Ruta</p>
                        <p className="font-medium text-foreground">{tripInfo.origin} → {tripInfo.destination}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                        <p className="text-muted-foreground">Fecha</p>
                        <p className="font-medium text-foreground">{tripInfo.date}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                        <p className="text-muted-foreground">Hora de salida</p>
                        <p className="font-medium text-foreground">{tripInfo.time}</p>
                    </div>
                </div>

            </div>

            {/* Selected seats */}
            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Asientos seleccionados</span>
                    <span className="font-medium text-foreground">
                        {selectedSeats.length > 0 ? selectedSeats.sort((a, b) => a - b).join(", ") : "Ninguno"}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cantidad</span>
                    <span className="font-medium text-foreground">{selectedSeats.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Precio por asiento</span>
                    <span className="font-medium text-foreground">${pricePerSeat.toFixed(2)}</span>
                </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                </div>
            </div>

            {/* Checkout button */}
            <Button
                onClick={onContinue}
                className="w-full"
                size="lg"
                disabled={disabledContinue}
            >
                <CreditCard className="w-4 h-4 mr-2" />
                {tripInfo.accionBtn}
            </Button>

            {selectedSeats.length === 0 && (
                <p className="text-xs text-center text-muted-foreground">
                    Selecciona al menos un asiento para continuar
                </p>
            )}
        </div>
    )
}
