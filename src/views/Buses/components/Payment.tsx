
import { useState, useMemo } from "react";
import { useTicket } from "../../auth/context/TicketContext"
import { formatDateDisplay } from "../../../shared/utils/helpers"
import { OrderSummary } from "./OrderSummary"
import PayForm from "./PayForm"



export default function Payment() {

    const { state, seatsSelected: selectedSeats, destinationSelected, cityOrigin, cityDestination, selectedSchedule, seats,
        handleConfirmTicketSale, handleTicketSaleCard, totalPassengers, showNofification,
    } = useTicket();
    const pricePerSeat = Number(destinationSelected?.baseFare) ?? 0;


    const [paymentMethod, setPaymentMethod] = useState<Payment['method']>("cash")
    const [cashReceived, setCashReceived] = useState("")
    const [formData, setFormData] = useState({
        id: state.customer?.id || 0,
        name: state.customer?.name || "",
        email: state.customer?.email || "",
        phone: state.customer?.phone || "",

    })

    const total = selectedSeats.length * pricePerSeat
    const serviceFee = total * 0.05
    const finalTotal = total + serviceFee

    const cashReceivedNumber = parseFloat(cashReceived) || 0
    const change = useMemo(() => {
        return cashReceivedNumber - finalTotal
    }, [cashReceivedNumber, finalTotal])

    const canCompleteCashPayment = cashReceivedNumber >= finalTotal

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }



    const handleCashReceivedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d.]/g, "")
        // Only allow one decimal point
        const parts = value.split(".")
        if (parts.length > 2) return
        if (parts[1]?.length > 2) return
        setCashReceived(value)
    }

    const quickCashAmounts = useMemo(() => {
        const rounded = Math.ceil(finalTotal / 100) * 100
        return [rounded, rounded + 100, rounded + 200, Math.ceil(finalTotal)]
    }, [finalTotal])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (paymentMethod === "cash" && !canCompleteCashPayment) {
            return
        }

        // setisloading(true)
        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000))

    }

    if (paymentMethod === "card") {
        showNofification({
            typeAlert: 'info',
            title: 'Función no implementada',
            message: 'La función de cobro con tarjeta no está implementada en esta versión.'

        })

    }


    return (
        <div className="min-h-screen bg-background">

            <main className="max-w-4xl mx-auto px-4 ">
                <h1 className="text-2xl font-bold text-foreground mb-8">Finalizar Compra</h1>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Form */}
                    <PayForm
                        handleSubmit={handleSubmit}
                        canCompleteCashPayment={canCompleteCashPayment}
                        cashReceived={cashReceived}
                        handleCashReceivedChange={handleCashReceivedChange}
                        cashReceivedNumber={cashReceivedNumber}
                        change={change}
                        finalTotal={finalTotal}
                        formData={formData}
                        handleInputChange={handleInputChange}
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                        quickCashAmounts={quickCashAmounts}
                        setCashReceived={setCashReceived}
                    />

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-2">

                        <OrderSummary
                            selectedSeats={seats.filter((s) => s.status === "selected").map((s) => s.seat_number)}
                            pricePerSeat={Number(destinationSelected?.baseFare) || 0}
                            onContinue={paymentMethod === 'cash' ? handleConfirmTicketSale : handleTicketSaleCard}
                            disabledContinue={paymentMethod === "cash" ? !canCompleteCashPayment : false}
                            tripInfo={{
                                origin: cityOrigin,
                                accionBtn: state.bookingType === 'reserve' ? 'Confirmar reservación' : 'Confirmar pago',
                                destination: cityDestination,
                                date: formatDateDisplay(state.departureDate),
                                time: selectedSchedule?.departure_time || "",
                                pasengers: totalPassengers,
                            }}
                        />
                    </div>

                </div>
            </main>
        </div>
    )
}
