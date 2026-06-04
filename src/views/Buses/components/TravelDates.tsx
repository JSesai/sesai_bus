
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Calendar, CalendarSync, MapPin } from "lucide-react";
import { useTicket } from "../../auth/context/TicketContext";
import { Input } from "../../components/ui/input";
import { formatDateDisplay, getDayName, minDateToday, oneMontFromToday, oneWeekFromToday } from "../../../shared/utils/helpers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useEffect } from "react";
import { SelectorSchedule } from "./SelectorSchedule";




export default function TravelDates({ resetSteps }: { resetSteps: () => void }) {

    const { state, dispatch, isRoundTrip, isReservation, backgrounTiketSale, isDateReturnValid, noDepertureTime,
        destinationSelected, showModalAlert } = useTicket();
    const { departureDate } = state;


    const handlerChangeSelectSchedule = (value: string) => {
        dispatch({ type: "SET_FIELD", field: "idSchedule", value: Number(value) })
    }



    const travelDay = getDayName(state.departureDate).toLowerCase();

    useEffect(() => {

        //este nunca deberia de verse, porque el select de horarios de salida solo se muestra si hay un destino seleccionado, pero por si acaso
        if (!destinationSelected) {
            showModalAlert({
                typeAlert: 'error',
                title: `Destino no seleccionado (error fatal)`,
                message: `Por favor, selecciona un destino antes de elegir la fecha y horario de salida.`,
                btnAccept: "Seleccionar destino",
                callbackAcept: () => {
                    resetSteps();
                },
            })
            return;
        }

        //si no hay salida/corrida para el destino en la fecha de salida seleccionada
        if (noDepertureTime) {

            dispatch({ type: "SET_FIELD", field: "idSchedule", value: 0 }) //reiniciamos el idSchedule seleccionado porque no hay corridas para esa fecha
            showModalAlert({
                typeAlert: 'info',
                title: `Sin salidas para el ${travelDay} ${formatDateDisplay(state.departureDate)}`,
                message: `No hay salidas programadas para ${destinationSelected.cityName} - ${destinationSelected.terminalName} . Revisa los horarios disponibles.`,
                btnAccept: "Cambiar destino",
                btnCancel: "Cambiar fecha de salida",
                callbackAcept: () => {
                    resetSteps();
                },
                callbackCancel: () => {
                    console.error("Cambiar fecha de salida");
                }
            })
        }

    }, [travelDay]);

    useEffect(() => {

        if (isRoundTrip && !isDateReturnValid) {
            showModalAlert({
                typeAlert: 'error',
                title: `Fecha de regreso no válida`,
                message: `La fecha de regreso no puede ser anterior a la fecha de salida. Por favor, selecciona una fecha de regreso válida.`,
                btnAccept: "Aceptar",
                callbackAcept: () => {
                    dispatch({ type: "SET_FIELD", field: "returnDate", value: "" })
                },
            })
        }
    }, [isDateReturnValid])

    return (
        <Card className={`${backgrounTiketSale} mt-12 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm transition-colors overflow-hidden`}>
            <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-semibold text-balance">{isRoundTrip ? "Fechas / Horarios" : "Fecha /horario"} </CardTitle>
                <CardDescription className="text-base text-balance">
                    Selecciona la fecha de salida{isRoundTrip && ' y fecha de regreso'}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-6">

                    <div className="space-y-3">
                        <Label className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Fecha de salida
                        </Label>
                        <div className="grid md:grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Input
                                    id="departureDate"
                                    type="date"
                                    value={departureDate}
                                    onChange={(e) => dispatch({ type: "SET_FIELD", field: "departureDate", value: e.target.value })}
                                    className="h-11"
                                    required
                                    min={minDateToday()}
                                    max={isReservation ? oneWeekFromToday() : oneMontFromToday()}
                                />
                            </div>


                        </div>
                    </div>

                    {/* <div className="space-y-3">
                        <Label htmlFor="destino" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            Horario de salida
                        </Label>
                        <Select defaultValue={String(state.idSchedule)} value={String(state.idSchedule)} onValueChange={handlerChangeSelectSchedule}>
                            <SelectTrigger id="destino" className="w-full py-5">
                                <SelectValue placeholder="Seleccionar destino" />
                            </SelectTrigger>
                            <SelectContent>
                                {scheduleToSelection?.map((schedule) => (
                                    <SelectItem key={schedule.id} value={String(schedule.id)}>
                                        {schedule.departure_time}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div> */}

                    {isRoundTrip && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <CalendarSync className="h-4 w-4 text-primary" />
                                Fecha de regreso
                            </Label>
                            <div className="grid md:grid-cols-1 gap-4">
                                <div className="space-y-2">

                                    <Input
                                        id="returnDate"
                                        type="date"
                                        value={state.returnDate}
                                        onChange={(e) => dispatch({ type: "SET_FIELD", field: "returnDate", value: e.target.value })}
                                        className="h-11"
                                        required
                                        min={minDateToday()}
                                        max={oneMontFromToday()}

                                    />
                                </div>

                            </div>
                        </div>
                    )}

                    <SelectorSchedule />

                </div>
            </CardContent>
        </Card >
    )
}
