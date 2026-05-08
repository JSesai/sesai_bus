import { useState, useLayoutEffect } from "react"
import { BusLayout } from "../BusLayout/BusLayout"
import { SeatLegend } from "./SeatLegend"
import { BusConfigurator } from "./BusConfigurator"
import { stepsTicketOffice, useTicket } from "../../auth/context/TicketContext"
import { Card } from "../../components/ui/card"

export function SeatSelection() {

    const { handleSeatSelect, vehicleForTripe, backgrounTiketSale, getSeatStatus, seats, state, currentStep } = useTicket();
    const [totalSeats, setTotalSeats] = useState(seats.length || 0);
    const [seatsPerRow, setSeatsPerRow] = useState(4)
    const [occupancyRate, setOccupancyRate] = useState(30)

    console.log({ totalSeats, seatsPerRow, occupancyRate, seats });

    useLayoutEffect(() => {
        //obtener los asientos disponibles con el query de la base de datos
        getSeatStatus()

    }, [currentStep])


    const handleTotalSeatsChange = (value: number) => {
        // Ensure total seats is divisible by seats per row
        const adjustedValue = Math.round(value / seatsPerRow) * seatsPerRow
        setTotalSeats(Math.max(adjustedValue, seatsPerRow))
    }

    const handleSeatsPerRowChange = (value: number) => {
        setSeatsPerRow(value)
        // Adjust total seats to be divisible by new seats per row
        const adjustedTotal = Math.round(totalSeats / value) * value
        setTotalSeats(Math.max(adjustedTotal, value))
    }


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

                    <BusConfigurator
                        totalSeats={totalSeats}
                        seatsPerRow={seatsPerRow}
                        occupancyRate={occupancyRate}
                        onTotalSeatsChange={handleTotalSeatsChange}
                        onSeatsPerRowChange={handleSeatsPerRowChange}
                        onOccupancyRateChange={setOccupancyRate}
                    />

                    {/* <OrderSummary
                        selectedSeats={selectedSeats}
                        pricePerSeat={450}
                        tripInfo={tripInfo}
                    /> */}
                </div>
            </div>

        </Card>
    )
}
