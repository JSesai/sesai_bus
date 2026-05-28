import { useAuth } from "../../auth/context/AuthContext";
import { useDashboard } from "../../auth/context/DashBoardContext";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { MapPin } from "lucide-react";
import { Button } from "../../components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../components/ui/command";
import { useTicket } from "../../auth/context/TicketContext";
import { toCapitalCase } from "../../shared/utils/helpers";
import { useState } from "react";


interface Props {
    agencyID: number;
    routeID: number;
    handlerChangeOrigin: (valueOnChange: string) => void;
    handlerChangeDestination: (valueOnChange: string) => void;
}

export default function SelectorsOriginDestination(options: Props) {
    const { agency, agencies, destinations } = useDashboard();
    const { destinationSelected } = useTicket();
    const { isSuperUser } = useAuth();
    const { agencyID, handlerChangeOrigin, handlerChangeDestination } = options;


    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    console.log({ search });


    const destinationfiltered = destinations.filter((destino) => destino.cityName.toLowerCase().includes(search.toLowerCase()));

    console.log({ destinationfiltered });


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
                                    {toCapitalCase(agency.city)}{' - '}{toCapitalCase(agency.name)}
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

                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between py-5"
                        >
                            {destinationSelected
                                ? `${toCapitalCase(destinationSelected.cityName)} - ${toCapitalCase(destinationSelected.terminalName)}`
                                : "Seleccionar destino"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput
                                placeholder="Buscar destino..."
                                value={search}
                                onValueChange={setSearch} // captura lo que escribe el usuario
                            />
                            <CommandList>
                                <CommandEmpty>No se encontró destino.</CommandEmpty>
                                <CommandGroup>
                                    {destinationfiltered
                                        .map((destino) => (
                                            <CommandItem
                                                key={destino.id}
                                                value={`${destino.cityName} ${destino.terminalName}`} // texto que se filtra                
                                                onSelect={() => {
                                                    setOpen(false); // cierra el popover al seleccionar un destino
                                                    handlerChangeDestination(String(destino.id))

                                                }}
                                            >
                                                {toCapitalCase(destino.cityName)} - {toCapitalCase(destino.terminalName)}
                                            </CommandItem>
                                        ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>


        </>


    )
}
