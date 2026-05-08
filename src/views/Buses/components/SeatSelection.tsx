import { useState, useLayoutEffect } from "react"
import { BusLayout } from "../BusLayout/BusLayout"
import { SeatLegend } from "./SeatLegend"
import { useTicket } from "../../auth/context/TicketContext"
import { Card } from "../../components/ui/card"
import { OrderSummary } from "./OrderSummary"
import { formatDateDisplay } from "../../../shared/utils/helpers"

export function SeatSelection() {

    const { handleSeatSelect, backgrounTiketSale, getSeatStatus, seats, state,
        cityOrigin, cityDestination, destinationSelected
    } = useTicket();
    const [totalSeats] = useState(seats.length || 0);
    const [seatsPerRow] = useState(4)

    console.log({ totalSeats, seats });

    useLayoutEffect(() => {
        //obtener los asientos disponibles con el query de la base de datos
        getSeatStatus()
        console.log('me ejecute');


    }, [])


    return (
        <Card className={`${backgrounTiketSale} dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm transition-colors overflow-hidden `}>

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

                    {/* <BusConfigurator
                        totalSeats={totalSeats}
                        seatsPerRow={seatsPerRow}
                        occupancyRate={occupancyRate}
                        onTotalSeatsChange={handleTotalSeatsChange}
                        onSeatsPerRowChange={handleSeatsPerRowChange}
                        onOccupancyRateChange={setOccupancyRate}
                    /> */}

                    <OrderSummary
                        selectedSeats={seats.filter((s) => s.status === "selected").map((s) => s.seat_number)}
                        pricePerSeat={Number(destinationSelected?.baseFare) || 0}
                        tripInfo={{
                            origin: cityOrigin,
                            destination: cityDestination,
                            date: formatDateDisplay(state.departureDate),
                            time: state.departureTime
                        }}
                    />
                </div>
            </div>

        </Card>
    )
}
