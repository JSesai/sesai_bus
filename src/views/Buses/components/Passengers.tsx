import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Users, Minus, Plus } from "lucide-react";
import { useTicket } from "../../auth/context/TicketContext";
import { useEffect, useRef } from "react";



export default function Passengers() {

    const { state, dispatch, backgrounTiketSale, showNofification, totalPassengers, seats, getSeatStatus, handleRegisterTicketAtBack, vehicleForTripe } = useTicket();

    const seatsAvailable = seats.filter((s) => s.status === "available" || s.status === "selected").length;

    const handleAddPassenger = (type: "adults" | "children" | "inapam") => {
        console.log(totalPassengers, seatsAvailable);
        console.log('seats', seats);

        if (totalPassengers >= seatsAvailable) {
            showNofification({ typeAlert: 'error', title: 'Limite de pasajeros alcanzado', message: `No puedes agregar más pasajeros. Solo hay ${seatsAvailable} asientos disponibles para este horario.` })
            return;
        }

        if (type === "inapam") {
            const inapamLimit = vehicleForTripe?.inapamSeats ?? 0;
            if (inapamLimit === 0) {
                showNofification({ typeAlert: 'error', title: 'INAPAM no disponible', message: 'Este vehículo no tiene asientos INAPAM configurados.' })
                return;
            }
            if (state.passengers.inapam >= inapamLimit) {
                showNofification({ typeAlert: 'error', title: 'Límite INAPAM alcanzado', message: `Solo hay ${inapamLimit} asiento(s) INAPAM disponibles en este vehículo.` })
                return;
            }
        }

        dispatch({ type: "UPDATE_PASSENGERS", passengers: { [type]: state.passengers[type] + 1 } })
    }

    const handleRemovePassenger = (type: "adults" | "children" | "inapam") => {
        if (state.passengers[type] === 0) return;

        dispatch({ type: "UPDATE_PASSENGERS", passengers: { [type]: state.passengers[type] - 1 } })
    }

    useEffect(() => {
        //obtener los asientos disponibles con el query de la base de datos
        getSeatStatus();

    }, []);

    const executedRef = useRef(false);
    useEffect(() => {
        if (!executedRef.current) {
            executedRef.current = true;
            handleRegisterTicketAtBack();
        }
    }, []);


    return (
        <Card className={`${backgrounTiketSale} mt-12 overflow-hidden`}>
            <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-semibold text-balance">Pasajeros</CardTitle>
                <CardDescription className="text-base text-balance">
                    Especifica el número de pasajeros por categoría: adultos, niños y personas con INAPAM.
                </CardDescription>
            </CardHeader>

            <CardContent>
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
                                    onClick={() => handleRemovePassenger("adults")}
                                    disabled={state.passengers.adults === 0}
                                    className="h-8 w-8"
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className={`w-8 text-center font-bold text-2xl`}>{state.passengers.adults}</span>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleAddPassenger("adults")}
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
                                    onClick={() => handleRemovePassenger("children")}
                                    disabled={state.passengers.children === 0}
                                    className="h-8 w-8"
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center font-bold text-2xl">{state.passengers.children}</span>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleAddPassenger("children")}
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
                                <p className="text-sm text-muted-foreground">
                                    Tercera edad
                                    {(vehicleForTripe?.inapamSeats ?? 0) > 0
                                        ? ` — ${state.passengers.inapam}/${vehicleForTripe?.inapamSeats} disponibles`
                                        : ' — Sin asientos disponibles'}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleRemovePassenger("inapam")}
                                    disabled={state.passengers.inapam === 0}
                                    className="h-8 w-8"
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className={`w-8 text-center font-bold text-2xl ${(vehicleForTripe?.inapamSeats ?? 0) === 0 ? 'text-muted-foreground' : ''}`}>{state.passengers.inapam}</span>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleAddPassenger("inapam")}
                                    disabled={(vehicleForTripe?.inapamSeats ?? 0) === 0 || state.passengers.inapam >= (vehicleForTripe?.inapamSeats ?? 0)}
                                    className="h-8 w-8"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-border">
                            <p className="font-bold text-2xl">
                                Total de pasajeros: <span className="text-primary">{totalPassengers}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card >
    )
}
