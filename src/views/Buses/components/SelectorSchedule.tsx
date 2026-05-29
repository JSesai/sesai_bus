import { useEffect, useLayoutEffect, useState } from "react"
import {
    Clock,
    MapPin,
    Users,
    ChevronDown,
    ChevronUp,
    Wifi,
    Plug,
    Wind,
    Tv,
    Coffee,
    ArrowRight,
    Sparkles,
    Star,
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { cn } from "../../lib/utils"
import { useTicket } from "../../auth/context/TicketContext"
import { useDashboard } from "../../auth/context/DashBoardContext"





const serviceTypeConfig = {
    regular: { label: "Regular", color: "bg-secondary text-secondary-foreground" },
    plus: { label: "Plus", color: "bg-primary/10 text-primary" },
    platino: { label: "Platino", color: "bg-amber-500/10 text-amber-600" },
    primera: { label: "Primera Clase", color: "bg-violet-500/10 text-violet-600" }
}

const tripTypeConfig = {
    directo: { label: "Directo", color: "bg-accent/10 text-accent" },
    local: { label: "Viaje local", color: "bg-blue-500/10 text-blue-600" },
    "de paso": { label: "De paso", color: "bg-orange-500/10 text-orange-600" }
}

const amenityIcons: Record<string, React.ReactNode> = {
    wifi: <Wifi className="w-4 h-4" />,
    enchufes: <Plug className="w-4 h-4" />,
    "aire acondicionado": <Wind className="w-4 h-4" />,
    entretenimiento: <Tv className="w-4 h-4" />,
    snacks: <Coffee className="w-4 h-4" />
}

type SortOption = "departure" | "price" | "duration"

function TripCard({ trip, origin, destination, discount, originalPrice, price,
    originTerminal, destinationTerminal, estimatedTravelTime, onSelect
}: {
    trip: Schedule; origin: string; destination: string; discount?: number; originalPrice: number;
    originTerminal: string; destinationTerminal: string; estimatedTravelTime: string;
    price: number; onSelect: () => void
}) {

    const [isExpanded, setIsExpanded] = useState(false);
    const [availableSeats, setAvailableSeats] = useState<number>(0);
    const [totalSeats, setTotalSeats] = useState<number>(0);

    const seatsPercentage = (availableSeats / totalSeats) * 100;
    const isLowSeats = availableSeats <= 10;

    useLayoutEffect(() => {

        window.electron.schedules.getVehicleSeatStatus(trip.id).then(response => {
            console.log("Estado de los asientos para el viaje", trip.id, response);

            if (response.ok) {
                const seatData = response.data as SeatData[]
                setAvailableSeats(seatData.filter((seat) => seat.status === "available").length);
                setTotalSeats(seatData.length);



                return response.data
            } else {
                console.error("Error al obtener el estado de los asientos:", response.error);
                return null
            }
        })

    }, [])



    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden transition-all hover:shadow-lg hover:border-primary/30">
            <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">

                    {/* Time and Route */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="text-center">
                            </div>
                            <div className="space-y-2">
                                <div className="text-center text-2xl font-bold text-foreground">{trip.departure_time}</div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-primary mt-0.5" />
                                    <div className="text-center">
                                        <div className="text-sm font-medium text-foreground">{origin}</div>
                                        <div className="text-xs text-muted-foreground">{originTerminal}</div>
                                    </div>
                                </div>

                            </div>


                            <div className="flex-1 flex items-center gap-2 px-2">
                                <div className="h-2 w-2 rounded-full bg-green-100" />
                                <div className="flex-1 relative">
                                    <div className="h-0.5 bg-border" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2">
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {estimatedTravelTime}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-blue-400" />
                            </div>

                            <div className="text-center">
                            </div>

                            <div className="space-y-2">
                                <div className="text-center text-2xl font-bold text-foreground">{trip.arrival_time}</div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-accent mt-0.5" />
                                    <div className="text-center">
                                        <div className="text-sm font-medium text-foreground">{destination}</div>
                                        <div className="text-xs text-muted-foreground">{destinationTerminal}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            <Badge className={cn("text-xs font-medium hidden md:inline-flex", serviceTypeConfig.regular.color)}>
                                Autobus# {trip.vehicle_number}
                            </Badge>
                            <Badge className={cn("text-xs font-medium", tripTypeConfig.local.color)}>
                                {tripTypeConfig.local.label}
                            </Badge>
                            {discount && (
                                <Badge className="text-xs font-medium bg-destructive/10 text-destructive">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    -{discount}%
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 md:w-44 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                        <div className="text-right">
                            {originalPrice && (
                                <div className="text-sm text-muted-foreground line-through">
                                    ${originalPrice.toLocaleString()} MXN
                                </div>
                            )}
                            <div className="text-2xl font-bold text-foreground">
                                ${price.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">MXN</span>
                            </div>
                            <div className="text-xs text-muted-foreground">Precio por persona</div>
                        </div>

                        <Button disabled={availableSeats === 0} onClick={onSelect} className="shrink-0">
                            Seleccionar
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>

                {/* Seats availability bar */}
                <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className={cn(
                                "text-sm font-medium",
                                isLowSeats ? "text-destructive" : "text-foreground"
                            )}>
                                {availableSeats} asientos disponibles
                            </span>
                            {isLowSeats && (
                                <Badge variant="destructive" className="text-xs">
                                    {availableSeats === 0 ? 'Corrida llena' : 'Ultimos lugares'}
                                </Badge>
                            )}
                        </div>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                            Ver detalles
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all",
                                seatsPercentage > 50 ? "bg-green-100" : seatsPercentage > 20 ? "bg-amber-500" : "bg-destructive"
                            )}
                            style={{ width: `${seatsPercentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Expanded details */}
            {isExpanded && (
                <div className="px-5 pb-5 pt-2 bg-secondary/30 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Ruta</h4>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-primary mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-foreground">{origin}</div>
                                        <div className="text-xs text-muted-foreground">{originTerminal}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-accent mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-foreground">{destination}</div>
                                        <div className="text-xs text-muted-foreground">{destinationTerminal}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Amenidades</h4>
                            <div className="flex flex-wrap gap-2">
                                {['baños', 'aire acondicionado', 'enchufes'].map((amenity) => (
                                    <div
                                        key={amenity}
                                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-card rounded-lg border border-border text-xs text-muted-foreground"
                                    >
                                        {amenityIcons[amenity] || <Star className="w-4 h-4" />}
                                        <span className="capitalize">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export function SelectorSchedule() {

    const { scheduleToSelection, cityOrigin, cityDestination, destinationSelected, dispatch, handleNext } = useTicket();
    const { destinations } = useDashboard();

    const [sortBy, setSortBy] = useState<SortOption>("departure")
    const [filterService, setFilterService] = useState<string | null>(null)

    const sortedTrips = [...scheduleToSelection].sort((a, b) => {
        switch (sortBy) {
            case "price":
                return a.vehicle_number - b.vehicle_number
            case "duration":
                return parseInt(a.departure_time) - parseInt(b.departure_time)
            case "departure":
            default:
                return a.departure_time.localeCompare(b.departure_time)
        }
    }).filter(trip => !filterService || trip.dateDeparture === filterService)


    return (
        <div className="space-y-6">

            {/* Trip list */}
            <div className="space-y-4">
                {sortedTrips.map((trip) => (
                    <TripCard
                        key={trip.id}
                        trip={trip}
                        onSelect={() => {
                            dispatch({ type: "SET_FIELD", field: "idSchedule", value: trip.id })
                            handleNext();
                        }}
                        destination={cityDestination}
                        origin={cityOrigin}
                        originTerminal={trip.terminal_origin}
                        destinationTerminal={trip.terminal_destination}
                        originalPrice={999}
                        price={destinations.find((d) => d.id === destinationSelected?.id)?.baseFare || 0}
                        estimatedTravelTime={String(destinationSelected?.estimatedTravelTime ?? '')}


                    />
                ))}
            </div>

            {sortedTrips.length === 0 && (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <div className="text-muted-foreground">No se encontraron viajes para la fecha selecionada</div>
                </div>
            )}
        </div>
    )
}
