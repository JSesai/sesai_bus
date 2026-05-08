import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Ticket } from "lucide-react"
import { useTicket } from "../../auth/context/TicketContext"


export default function TravelTypeAndBookingType() {

    const { state, dispatch, backgrounTiketSale } = useTicket();

    return (
        <Card className={`${backgrounTiketSale} mt-12 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm transition-colors overflow-hidden`}>
            <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-semibold text-balance">Tipo de operación y viaje</CardTitle>
                <CardDescription className="text-base text-balance">
                    Selecciona si deseas comprar o reservar tu boleto, y elige el tipo de viaje: solo ida o ida y vuelta.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-6">

                    <div className="space-y-3">
                        <Label className="text-sm font-medium"> <Ticket className="h-4 w-4" />Tipo de operación </Label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => dispatch({ type: "SET_FIELD", field: "bookingType", value: "purchase" })}
                                className={`p-2 rounded-lg border-2 transition-all ${state.bookingType === "purchase"
                                    ? "border-cyan-500 bg-primary/5 text-primary font-medium"
                                    : "border-border hover:border-primary/50"
                                    }`}
                            >
                                Comprar
                            </button>
                            <button
                                type="button"
                                onClick={() => dispatch({ type: "SET_FIELD", field: "bookingType", value: "reserve" })}
                                className={`p-2 rounded-lg border-2 transition-all ${state.bookingType === "reserve"
                                    ? "border-cyan-500 bg-primary/5 text-primary font-medium"
                                    : "border-border hover:border-primary/50"
                                    }`}
                            >
                                Reserar
                            </button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Tipo de viaje</Label>
                        <div className="grid grid-cols-2 gap-3">

                            <button
                                type="button"
                                onClick={() => dispatch({ type: "SET_FIELD", field: "travelType", value: "round-trip" })}
                                className={`p-2 rounded-lg border-2 transition-all ${state.travelType === "round-trip"
                                    ? "border-cyan-500 bg-primary/5 text-primary font-medium"
                                    : "border-border hover:border-primary/50"
                                    }`}
                            >
                                Ida y vuelta
                            </button>
                            <button
                                type="button"
                                onClick={() => dispatch({ type: "SET_FIELD", field: "travelType", value: "one-way" })}
                                className={`p-2 rounded-lg border-2 transition-all ${state.travelType === "one-way"
                                    ? "border-cyan-500 bg-primary/5 text-primary font-medium"
                                    : "border-border hover:border-primary/50"
                                    }`}
                            >
                                Solo ida
                            </button>

                        </div>
                    </div>

                </div>
            </CardContent>
        </Card >
    )
}
