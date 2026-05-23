import { useState } from "react"
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

interface TripSelectorProps {
    trips: Trip[]
    origin: string
    destination: string
    date: string
    onSelectTrip: (trip: Trip) => void
}

export interface Trip {
    id: string
    busModel: string
    busNumber: string
    serviceType: "regular" | "plus" | "platino" | "primera"
    departureTime: string
    arrivalTime: string
    duration: string
    origin: string
    originTerminal: string
    destination: string
    destinationTerminal: string
    originalPrice?: number
    price: number
    availableSeats: number
    totalSeats: number
    tripType: "directo" | "local" | "de paso"
    amenities: string[]
    discount?: number
}














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

function TripCard({ trip, onSelect }: { trip: Trip; onSelect: () => void }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const seatsPercentage = 10
    const isLowSeats = trip.availableSeats <= 10

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden transition-all hover:shadow-lg hover:border-primary/30">
            <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Company Info */}
                    <div className="flex items-center gap-4 md:w-40 shrink-0">
                        <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center">
                            <span className="text-lg font-bold text-foreground">My company</span>
                        </div>
                        <div className="md:hidden">
                            <Badge className={cn("text-xs font-medium", serviceTypeConfig[trip.serviceType].color)}>
                                {serviceTypeConfig[trip.serviceType].label}
                            </Badge>
                        </div>
                    </div>

                    {/* Time and Route */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-foreground">{trip.departureTime}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-24">{trip.originTerminal}</div>
                            </div>

                            <div className="flex-1 flex items-center gap-2 px-2">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <div className="flex-1 relative">
                                    <div className="h-0.5 bg-border" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2">
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {trip.duration}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-accent" />
                            </div>

                            <div className="text-center">
                                <div className="text-2xl font-bold text-foreground">{trip.arrivalTime}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-24">{trip.destinationTerminal}</div>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            <Badge className={cn("text-xs font-medium hidden md:inline-flex", serviceTypeConfig[trip.serviceType].color)}>
                                {serviceTypeConfig[trip.serviceType].label}
                            </Badge>
                            <Badge className={cn("text-xs font-medium", tripTypeConfig[trip.tripType].color)}>
                                {tripTypeConfig[trip.tripType].label}
                            </Badge>
                            {trip.discount && (
                                <Badge className="text-xs font-medium bg-destructive/10 text-destructive">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    -{trip.discount}%
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 md:w-44 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                        <div className="text-right">
                            {trip.originalPrice && (
                                <div className="text-sm text-muted-foreground line-through">
                                    ${trip.originalPrice.toLocaleString()} MXN
                                </div>
                            )}
                            <div className="text-2xl font-bold text-foreground">
                                ${trip.price.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">MXN</span>
                            </div>
                            <div className="text-xs text-muted-foreground">Precio por persona</div>
                        </div>

                        <Button onClick={onSelect} className="shrink-0">
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
                                {trip.availableSeats} asientos disponibles
                            </span>
                            {isLowSeats && (
                                <Badge variant="destructive" className="text-xs">
                                    Ultimos lugares
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
                                seatsPercentage > 50 ? "bg-accent" : seatsPercentage > 20 ? "bg-amber-500" : "bg-destructive"
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
                                        <div className="text-sm font-medium text-foreground">{trip.origin}</div>
                                        <div className="text-xs text-muted-foreground">{trip.originTerminal}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-accent mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-foreground">{trip.destination}</div>
                                        <div className="text-xs text-muted-foreground">{trip.destinationTerminal}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Amenidades</h4>
                            <div className="flex flex-wrap gap-2">
                                {trip.amenities.map((amenity) => (
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

export function SelectorSchedule({ trips, origin, destination, date, onSelectTrip }: TripSelectorProps) {
    const [sortBy, setSortBy] = useState<SortOption>("departure")
    const [filterService, setFilterService] = useState<string | null>(null)

    const sortedTrips = [...trips].sort((a, b) => {
        switch (sortBy) {
            case "price":
                return a.price - b.price
            case "duration":
                return parseInt(a.duration) - parseInt(b.duration)
            case "departure":
            default:
                return a.departureTime.localeCompare(b.departureTime)
        }
    }).filter(trip => !filterService || trip.serviceType === filterService)


    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">
                    Horarios y precios de ida
                </h1>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium text-foreground">{origin}</span>
                    <ArrowRight className="w-4 h-4" />
                    <span className="font-medium text-foreground">{destination}</span>
                    <span className="mx-2">|</span>
                    <span>{date}</span>
                </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
                Mostrando <span className="font-semibold text-foreground">{sortedTrips.length}</span> viajes disponibles
            </div>

            {/* Trip list */}
            <div className="space-y-4">
                {sortedTrips.map((trip) => (
                    <TripCard
                        key={trip.id}
                        trip={trip}
                        onSelect={() => onSelectTrip(trip)}
                    />
                ))}
            </div>

            {sortedTrips.length === 0 && (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <div className="text-muted-foreground">No se encontraron viajes con los filtros seleccionados</div>
                    <Button variant="link" onClick={() => setFilterService(null)}>
                        Limpiar filtros
                    </Button>
                </div>
            )}
        </div>
    )
}
