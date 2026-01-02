
import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { MapPin, Plus, Search, Edit, Trash2, ArrowLeft, Phone, MapIcon, RectangleEllipsis, WholeWord, BusIcon } from "lucide-react"
import RegisterBus from "./RegisterBus"

// Datos de ejemplo - reemplazar con datos de tu base de datos
const automobiles: Bus[] = [
    {
        id: 1,
        number: '',
        model: '',
        plate: '',
        seatingCapacity: 99,
        serialNumber: '',
        year: '',
        characteristics: '',
        status: 'active'
    },

]


export default function Buses() {
    const [buses, setBuses] = useState<Bus[]>(automobiles)
    const [searchTerm, setSearchTerm] = useState("")
    const [view, setView] = useState<"list" | "add" | "edit">("list")
    const [editingBus, setEditingBus] = useState<Bus | null>(null)

    useEffect(() => {
        window.electron.buses.getBuses().then(buses => setBuses(buses.data)).catch(e => console.log(e));
    }, [view])

    const handleEditDestino = (updatedDestino: Omit<Bus, "id">) => {
        if (editingBus) {
            setBuses(buses.map((d) => (d.id === editingBus?.id ? { ...updatedDestino, id: editingBus?.id } : d)))
            setEditingBus(null)
            setView("list")
        }
    }

    const handleDeletebuses = (id: number) => {
        if (confirm("ΒΏEstΓ's seguro de que deseas eliminar este destino?")) {
            setBuses(buses.filter((d) => d.id !== id))
        }
    }

    const handleToggleActivo = (id: number) => {
        // setDestinos(buses.map((d) => (d.id === id ? { ...d, activo: !d.activo } : d)))
    }

    const startEdit = (bus: Bus) => {
        setEditingBus(bus)
        setView("edit")
    }

    if (view === "add") {
        return (
            <div className="space-y-6">
                <Button variant="ghost" className="gap-2" onClick={() => {
                    setEditingBus(null);
                    setView("list");

                }}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a la lista
                </Button>
                <RegisterBus editingBus={null} />
            </div>
        )
    }

    if (view === "edit" && editingBus) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" onClick={() => setView("list")} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Volver a la lista
                </Button>
                <RegisterBus editingBus={editingBus} />
            </div>
        )
    }

    console.log(buses);


    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-balance mb-2">Gestión de Automobiles</h1>
                    <p className="text-muted-foreground text-pretty">Administra y gestiona la flotatilla de automobiles</p>
                </div>
                <Button onClick={() => setView("add")} size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Agregar automobil
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Buscar automobil"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11"
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {buses.map((buses) => (
                    <Card key={buses.id} className={`transition-all hover:shadow-md ${buses.status === 'disabled' ? "opacity-60" : ""}`}>
                        <CardContent className="p-5 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                        <BusIcon className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-balance">Autobus {buses.number}</h3>
                                        <p className="text-sm text-muted-foreground">{buses.model}</p>
                                    </div>
                                </div>
                                <Badge variant={buses.status === "active" ? "default" : "secondary"} className="text-xs">
                                    {buses.status === "active" ? "Activo" : "Inactivo"}
                                </Badge>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                    <RectangleEllipsis className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <span className="text-muted-foreground text-pretty">{buses.plate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <WholeWord className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">{buses.serialNumber}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground">Asientos</p>
                                    <p className="font-semibold text-sm">{buses.seatingCapacity}</p>
                                </div>

                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground">Año</p>
                                    <p className="font-semibold text-sm">{buses.year}</p>
                                </div>
                            </div>

                            {buses.characteristics && (
                                <p className="text-xs text-muted-foreground italic text-pretty border-t border-border pt-2">
                                    {buses.characteristics}
                                </p>
                            )}

                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" size="sm" onClick={() => startEdit(buses)} className="flex-1 gap-2">
                                    <Edit className="h-4 w-4" />
                                    Editar
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleToggleActivo(buses?.id ?? 0)} className="flex-1">
                                    {buses.status === "active" ? "Desactivar" : "Activar"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeletebuses(buses.id ?? 0)}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {buses.length === 0 && (
                <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No se encontraron destinos</h3>
                    <p className="text-muted-foreground mb-4">Intenta con otra búsqueda o agrega un nuevo destino</p>
                    <Button onClick={() => setView("add")} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Agregar Primer Destino
                    </Button>
                </div>
            )}
        </div>
    )
}
