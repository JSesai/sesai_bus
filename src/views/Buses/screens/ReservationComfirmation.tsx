import { CheckCircle2 } from 'lucide-react'
import { useTicket } from '../../auth/context/TicketContext'
import { formatDateDisplay } from '../../../shared/utils/helpers';
import { Button } from '../../components/ui/button';

export default function ReservationComfirmation() {

    const { cityOrigin, cityDestination, state, seatsSelected, destinationSelected, totalPassengers, handleConfirmReservation } = useTicket();
    const pricePerSeat = Number(destinationSelected?.baseFare) || 0;
    const total = totalPassengers * pricePerSeat;

    return (


        <div className="bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-card rounded-2xl border border-border p-8 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">Reservación de viaje</h2>
                    <p className="text-muted-foreground">
                        Revisa la información y comfirma la reservacion.
                    </p>
                </div>

                <div className="bg-muted/50 rounded-xl p-4 space-y-3 text-left">

                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ruta</span>
                        <span className="font-medium text-foreground">{cityOrigin} → {cityDestination}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fecha</span>
                        <span className="font-medium text-foreground">{formatDateDisplay(state.departureDate)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Asientos</span>
                        <span className="font-medium text-foreground">{seatsSelected.sort((a, b) => a - b).join(", ")}</span>
                    </div>

                    <div className="flex justify-between text-sm pt-2 border-t border-border">
                        <span className="text-muted-foreground">Total a pagar </span>
                        <span className="font-bold text-foreground">${total.toFixed(2)}</span>
                    </div>

                </div>


                <Button
                    onClick={handleConfirmReservation}
                    className="w-full" size="lg">
                    Comfirmar Reservación
                </Button>
            </div>
        </div>
    )



}
