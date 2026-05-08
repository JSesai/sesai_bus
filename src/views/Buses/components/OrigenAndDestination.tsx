import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { useTicket } from "../../auth/context/TicketContext";
import SelectorsOriginDestination from "./SelectorsOriginDestination";

export default function OrigenAndDestination() {

    const { state, dispatch, backgrounTiketSale } = useTicket();



    return (
        <Card className={`${backgrounTiketSale} dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm transition-colors overflow-hidden`}>
            <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-semibold text-balance">Origen/Destino</CardTitle>
                <CardDescription className="text-base text-balance">

                    Selecciona la ciudad de origen y el destino de tu viaje. Posteriormente selecciona el horario de salida.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-6">

                    <SelectorsOriginDestination
                        agencyID={state.idOrigin}
                        routeID={state.idDestination}
                        handlerChangeOrigin={(value) => dispatch({ type: "SET_FIELD", field: "idOrigin", value: +value })}
                        handlerChangeDestination={(value) => dispatch({ type: "SET_FIELD", field: "idDestination", value: +value })}

                    />

                </div>
            </CardContent>
        </Card >
    )
}
