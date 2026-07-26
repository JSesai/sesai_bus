import { useState, useLayoutEffect } from "react"
import { BusLayout } from "../BusLayout/BusLayout"
import { SeatLegend } from "./SeatLegend"
import { useTicket } from "../../auth/context/TicketContext"
import { useDashboard } from "../../auth/context/DashBoardContext"
import { Card } from "../../components/ui/card"
import { OrderSummary } from "./OrderSummary"
import { formatDateDisplay } from "../../../shared/utils/helpers"

export function SeatSelection() {

    const { handleSeatSelect, backgrounTiketSale, seats, state, cityOrigin, cityDestination,
        destinationSelected, totalPassengers, selectedSchedule, getSeatStatus, handleRegisterTicket,
        discountedPricePerSeat, vehicleForTripe, hasInapamPassengers
    } = useTicket();
    const { serviceFeePercent } = useDashboard();
    const [totalSeats] = useState(seats.length || 0);
    const [seatsPerRow] = useState(4)

    console.log({ totalSeats, seats });

    const inapamSeatsConfig = vehicleForTripe?.inapamSeats ?? 0;
    const inapamSeatsOccupied = seats.filter((s) => s.status === "occupied").length;
    const inapamLimitReached = inapamSeatsConfig > 0 && state.passengers.inapam >= inapamSeatsConfig;

    //obtener los asientos disponibles con el query de la base de datos
    useLayoutEffect(() => {
        getSeatStatus()

    }, [])


    return (
        <Card className={`${backgrounTiketSale} overflow-hidden`}>

            <div className="flex justify-around gap-8">
                {/* Left column - Bus layout */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="flex">
                        <BusLayout
                            seats={seats}
                            seatsPerRow={seatsPerRow}
                            onSeatSelect={handleSeatSelect}
                        />
                    </div>
                </div>

                {/* Right column - Configuration and summary */}
                <div className="space-y-6 col-span-1">

                    <SeatLegend />

                    {/* Stats */}
                    <div className="flex gap-1.5">
                        <div className="bg-card rounded-xl border border-border p-4 text-center">
                            <div className="text-2xl font-bold text-foreground">
                                {seats.filter((s) => s.status === "available").length}
                            </div>
                            <div className="text-xs text-muted-foreground">Disponibles</div>
                        </div>
                        <div className="bg-card rounded-xl border border-border p-4 text-center">
                            <div className="text-2xl font-bold text-primary">
                                {seats.filter((s) => s.status === "selected").length}
                            </div>
                            <div className="text-xs text-muted-foreground">Seleccionados</div>
                        </div>
                        <div className="bg-card rounded-xl border border-border p-4 text-center">
                            <div className="text-2xl font-bold text-muted-foreground">
                                {seats.filter((s) => s.status === "occupied").length}
                            </div>
                            <div className="text-xs text-muted-foreground">Ocupados</div>
                        </div>
                    </div>

                    {/* INAPAM info */}
                    {hasInapamPassengers && inapamSeatsConfig > 0 && (
                        <div className={`rounded-lg border p-3 text-sm ${inapamLimitReached
                            ? 'bg-status-cancelled/20 border-status-cancelled text-status-cancelled-foreground'
                            : 'bg-status-reserved/20 border-status-reserved text-status-reserved-foreground'
                            }`}>
                            {inapamLimitReached
                                ? `Límite INAPAM alcanzado (${state.passengers.inapam}/${inapamSeatsConfig}).`
                                : `Asientos INAPAM: ${state.passengers.inapam} de ${inapamSeatsConfig} seleccionados.`}
                        </div>
                    )}

                    {hasInapamPassengers && inapamSeatsConfig === 0 && (
                        <div className="rounded-lg bg-status-cancelled/20 border border-status-cancelled p-3 text-sm text-status-cancelled-foreground">
                            Este vehículo no tiene asientos INAPAM configurados.
                        </div>
                    )}


                    <OrderSummary
                        selectedSeats={seats.filter((s) => s.status === "selected").map((s) => s.seat_number)}
                        pricePerSeat={discountedPricePerSeat}
                        serviceFeePercent={serviceFeePercent}
                        onContinue={handleRegisterTicket}
                        disabledContinue={seats.filter((s) => s.status === "selected").map((s) => s.seat_number).length !== totalPassengers}
                        tripInfo={{
                            origin: cityOrigin,
                            accionBtn: state.bookingType === 'reserve' ? 'Continuar reservación' : 'Continuar al pago',
                            destination: cityDestination,
                            date: formatDateDisplay(state.departureDate),
                            time: selectedSchedule?.departure_time || "",
                            pasengers: totalPassengers,
                        }}
                    />
                </div>
            </div>

        </Card>
    )
}
