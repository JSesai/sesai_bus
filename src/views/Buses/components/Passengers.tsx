import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Users, Minus, Plus } from "lucide-react";
import { useTicket } from "../../auth/context/TicketContext";



export default function Passengers() {

    const { state, dispatch, backgrounTiketSale, showNofification, hasInapamPassengers, totalPassengers } = useTicket();

    if (hasInapamPassengers) {
        showNofification({ typeAlert: 'info', title: 'Informa al cliente', message: 'Los asientos para INAPAN estan sujetos a disponibilidad.' })
    }


    return (
        <Card className={`${backgrounTiketSale} mt-12 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm transition-colors overflow-hidden`}>
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
                                    onClick={() => dispatch({ type: "UPDATE_PASSENGERS", passengers: { adults: state.passengers.adults - 1 } })}
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
                                <span className="w-8 text-center font-bold text-2xl">{state.passengers.children}</span>
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
                                <span className="w-8 text-center font-bold text-2xl">{state.passengers.inapam}</span>
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
