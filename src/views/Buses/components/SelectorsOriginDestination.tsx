import { useAuth } from "../../auth/context/AuthContext";
import { useDashboard } from "../../auth/context/DashBoardContext";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { MapPin } from "lucide-react";


interface Props {
    agencyID: number;
    routeID: number;
    handlerChangeOrigin: (valueOnChange: string) => void;
    handlerChangeDestination: (valueOnChange: string) => void;
}

export default function SelectorsOriginDestination(options: Props) {
    const { agency, agencies, destinations } = useDashboard();
    const { isSuperUser } = useAuth();
    const { agencyID, routeID, handlerChangeOrigin, handlerChangeDestination } = options;

    return (
        <>
            {isSuperUser ?
                <div className="space-y-2">
                    <Label htmlFor="destino" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        Origen
                    </Label>
                    <Select defaultValue={String(agencyID)} value={String(agencyID)} onValueChange={handlerChangeOrigin}>
                        <SelectTrigger id="destino" className="w-full py-5">
                            <SelectValue placeholder="Seleccionar destino" />
                        </SelectTrigger>
                        <SelectContent>
                            {agencies?.map((agency) => (
                                <SelectItem key={agency.id} value={String(agency.id)}>
                                    {agency.city.toUpperCase()}{' - '}{agency.name.toUpperCase()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                :
                <div className="space-y-2">
                    <Label htmlFor="horaSalida" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        Origen
                    </Label>
                    <Input
                        id="horaSalida"
                        type="text"
                        value={`${agency?.city.toUpperCase()} - ${agency?.name.toUpperCase()}`}
                        className="h-11"
                        required
                        disabled
                    />
                </div>

            }


            <div className="space-y-2">
                <Label htmlFor="destino" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Destino
                </Label>
                <Select defaultValue={String(routeID)} value={String(routeID)} onValueChange={handlerChangeDestination}>
                    <SelectTrigger id="destino" className="w-full py-5">
                        <SelectValue placeholder="Seleccionar destino" />
                    </SelectTrigger>
                    <SelectContent>
                        {destinations.map((destino) => (
                            <SelectItem key={destino.id} value={String(destino.id)}>
                                {destino.cityName.toUpperCase()}{' - '}{destino.terminalName.toUpperCase()}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

        </>


    )
}
