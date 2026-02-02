
import type React from "react"
import { useReducer, useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { MapPin, Calendar, Users, Minus, Plus, ArrowRight, CheckCircle2, Repeat, Ticket } from "lucide-react"
import { useDashboard } from "../../auth/context/DashBoardContext"
import { useTicket } from "../../auth/context/TicketContext"



interface PassengerCounts {
    adults: number
    children: number
    inapam: number
}

export default function TicketBookingForm() {

    const { agency } = useDashboard();
    const { state, dispatch, isLoading } = useTicket();

    console.log('this is the state ticket', state);


    // // const [tripType, setTripType] = useState<TripType | null>(null)
    // const [passengers, setPassengers] = useState<PassengerCounts>({
    //     adults: 1,
    //     children: 0,
    //     inapam: 0,
    // })
    // const [origin, setOrigin] = useState("")
    // const [destination, setDestination] = useState("")
    // const [departureDate, setDepartureDate] = useState("")
    // const [departureTime, setDepartureTime] = useState("")
    // const [returnDate, setReturnDate] = useState("")
    // const [returnTime, setReturnTime] = useState("")
    // const [isLoading, setIsLoading] = useState(false)
    // const [success, setSuccess] = useState(false)
    // const [bookingType, setBookingType] = useState<BookingType | null>(null)



    const timeSlots = ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"]

    // const handleChangeOrigin = () => {
    //     setOrigin(destination);
    //     setDestination(origin);
    // }

    // const updatePassengerCount = (type: keyof PassengerCounts, increment: boolean) => {
    //     setPassengers((prev) => ({
    //         ...prev,
    //         [type]: increment ? prev[type] + 1 : Math.max(0, prev[type] - 1),
    //     }))
    // }

    // const getTotalPassengers = () => {
    //     return passengers.adults + passengers.children + passengers.inapam
    // }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // setIsLoading(true)
        // setSuccess(false)

        // // SimulaciΓ³n de reserva - AquΓ­ integrarΓ­as tu API
        // setTimeout(() => {
        //     setSuccess(true)
        //     setIsLoading(false)
        // }, 1500)
    }

    // if (success) {
    //     return (
    //         <Card className="w-full max-w-3xl shadow-lg">
    //             <CardContent className="pt-12 pb-12 text-center">
    //                 <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
    //                     <CheckCircle2 className="w-10 h-10 text-green-600" />
    //                 </div>
    //                 <h3 className="text-2xl font-semibold mb-2">Boletos reservados exitosamente</h3>
    //                 <p className="text-muted-foreground mb-6">Los boletos han sido registrados en el sistema</p>
    //                 <Button onClick={() => setSuccess(false)} variant="outline">
    //                     Nueva venta
    //                 </Button>
    //             </CardContent>
    //         </Card>
    //     )
    // }

    return (
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-semibold text-balance">Venta de Boletos</CardTitle>
                <CardDescription className="text-base text-balance">
                    Completa la información del viaje del pasajero
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">

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
                                onClick={() => dispatch({ type: "SET_FIELD", field: "tripType", value: "one-way" })}
                                className={`p-2 rounded-lg border-2 transition-all ${state.tripType === "one-way"
                                    ? "border-cyan-500 bg-primary/5 text-primary font-medium"
                                    : "border-border hover:border-primary/50"
                                    }`}
                            >
                                Solo ida
                            </button>
                            <button
                                type="button"
                                onClick={() => dispatch({ type: "SET_FIELD", field: "tripType", value: "round-trip" })}
                                className={`p-2 rounded-lg border-2 transition-all ${state.tripType === "round-trip"
                                    ? "border-cyan-500 bg-primary/5 text-primary font-medium"
                                    : "border-border hover:border-primary/50"
                                    }`}
                            >
                                Ida y vuelta
                            </button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Label className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Fecha de salida
                        </Label>
                        <div className="grid md:grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="departureDate" className="text-xs text-muted-foreground">
                                    Fecha de ida
                                </Label>
                                <Input
                                    id="departureDate"
                                    type="date"
                                    value={state.departureDate}
                                    onChange={(e) => dispatch({ type: "SET_FIELD", field: "departureDate", value: e.target.value })}
                                    className="h-11"
                                    required
                                    min={new Date().toISOString().split("T")[0]}
                                />
                            </div>
                           
                        </div>
                    </div>


                    <div className="space-y-4">
                        <Label className="text-sm font-medium flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Número de pasajeros
                        </Label>
                        <div className="space-y-3 bg-muted/20 p-4 rounded-lg">
                            {/* Adultos */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Adultos</p>
                                    <p className="text-sm text-muted-foreground">Más de 12 años</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => dispatch({ type: "UPDATE_PASSENGERS", passengers: { adults: state.passengers.adults - 1 } })}
                                        disabled={state.passengers.adults === 0}
                                        className="h-8 w-8"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className={`w-8 text-center font-medium ${state.passengers.adults > 0 ? 'text-green-500' : ''}`}>{state.passengers.adults}</span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => dispatch({ type: "UPDATE_PASSENGERS", passengers: { adults: state.passengers.adults + 1 } })}
                                        className="h-8 w-8"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* NiΓ±os */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Niños</p>
                                    <p className="text-sm text-muted-foreground">2 a 12 años</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => dispatch({ type: "UPDATE_PASSENGERS", passengers: { children: state.passengers.children - 1 } })}
                                        disabled={state.passengers.children === 0}
                                        className="h-8 w-8"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center font-medium">{state.passengers.children}</span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => dispatch({ type: "UPDATE_PASSENGERS", passengers: { children: state.passengers.children + 1 } })}
                                        className="h-8 w-8"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* INAPAM */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">INAPAM</p>
                                    <p className="text-sm text-muted-foreground">Tercera edad</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => dispatch({ type: "UPDATE_PASSENGERS", passengers: { inapam: state.passengers.inapam - 1 } })}
                                        disabled={state.passengers.inapam === 0}
                                        className="h-8 w-8"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center font-medium">{state.passengers.inapam}</span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => dispatch({ type: "UPDATE_PASSENGERS", passengers: { inapam: state.passengers.inapam + 1 } })}
                                        className="h-8 w-8"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-border">
                                <p className="text-sm font-medium">
                                    Total de pasajeros: <span className="text-primary">{state.totalPassengers}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 items-end">
                        {/* ORIGEN */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Origen
                            </Label>
                            <Select value={state.origin} onValueChange={() => { }} required>
                                <SelectTrigger className="h-11 w-full">
                                    <SelectValue placeholder="Selecciona ciudad de origen" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[agency].map((city) => (
                                        <SelectItem key={city?.id} defaultChecked value={String(city?.id) ?? '0'} /*disabled={city === destination}*/ >
                                            {city?.city}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* BOTÓN */}
                        <div className="flex items-center justify-center h-full">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-11 w-11"
                                disabled
                            >
                                <Repeat className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* DESTINO */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                Destino
                            </Label>
                            <Select value={state.destination} onValueChange={() => { }} required>
                                <SelectTrigger className="h-11 w-full">
                                    <SelectValue placeholder="Selecciona ciudad de destino" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[].map((city) => (
                                        <SelectItem key={city} value={city} disabled={city === origin}>
                                            {city}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>


                    {state.tripType === "round-trip" && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <ArrowRight className="h-4 w-4 text-primary" />
                                Fecha y hora de regreso
                            </Label>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="returnDate" className="text-xs text-muted-foreground">
                                        Fecha de regreso
                                    </Label>
                                    <Input
                                        id="returnDate"
                                        type="date"
                                        value={state.returnDate}
                                        onChange={(e) => dispatch({ type: "SET_FIELD", field: "returnDate", value: e.target.value })}
                                        className="h-11"
                                        required
                                        min={state.departureDate || new Date().toISOString().split("T")[0]}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="returnTime" className="text-xs text-muted-foreground">
                                        Hora de regreso
                                    </Label>
                                    <Select value={state.returnTime} onValueChange={() => { }} required>
                                        <SelectTrigger id="returnTime" className="h-11">
                                            <SelectValue placeholder="Selecciona hora" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeSlots.map((time) => (
                                                <SelectItem key={time} value={time}>
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-12 text-base font-medium"
                        disabled={isLoading || state.totalPassengers === 0}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                Procesando reserva...
                            </span>
                        ) : (
                            "Continuar"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card >
    )
}
