import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Clock, Plus, Search, Edit, Trash2, Bus, MapPin, Calendar, Contact, PhoneCall, LandPlot } from "lucide-react"
import ScheduleForm from "./ScheduleForm"
import { useDashboard } from "../../auth/context/DashBoardContext"
import { useSearchParams } from "react-router-dom"
import { toCapitalCase } from "../../shared/utils/helpers"
import AgencieForm from "./AgencieForm"


const viewCurrent = "viewAtAgencies;"

export default function AgenciesManager() {
    const { agencies } = useDashboard();
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchTerm, setSearchTerm] = useState("")
    const [editingAgency, setEditingAgency] = useState<Agency | null>(null)

    const viewActiveAtAgencies = searchParams.get(viewCurrent) ?? "list";


   

    const handleToggleActivo = (id: number) => {
        
    }

    const startEdit = (agency: Agency) => {
        setEditingAgency(agency)
        setSearchParams(prev => {
            prev.set(viewCurrent, 'edit')
            return prev;
        })
    }

    if (viewActiveAtAgencies === "add") {
        return (
            <div className="space-y-6">

                <AgencieForm onCancel={() => {
                    setSearchParams(prev => {
                        prev.set(viewCurrent, 'list')
                        return prev;
                    })
                }} />
            </div>
        )
    }

    if (viewActiveAtAgencies === "edit" && editingAgency) {
        return (
            <div className="space-y-6">

                <AgencieForm
                    editingAgency={editingAgency}
                    configInitial={false}
                    onCancel={() => {
                        setEditingAgency(null)
                        setSearchParams(prev => {
                            prev.set(viewCurrent, 'list')
                            return prev;
                        })
                    }}
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-balance mb-2">Gestión las Agencias registradas en el sistema</h1>
                    <p className="text-muted-foreground text-pretty">Administra las agencias disponibles</p>
                </div>
                {(agencies?.length ?? 0) > 0 &&
                    <Button onClick={() => {
                        setSearchParams(prev => {
                            prev.set(viewCurrent, 'add')
                            return prev;
                        })
                    }} size="lg" className="gap-2">
                        <Plus className="h-5 w-5" />
                        Agregar Agencia
                    </Button>

                }
            </div>


            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Buscar por nombre, ciudad o nombre de la agencia..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11"
                />
            </div>


            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {agencies?.map((agency) => (
                    <Card key={agency.id} className={"transition-all hover:shadow-md"}>
                        <CardContent className="p-5 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                        <LandPlot className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-base text-balance">
                                            {agency.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Ciudad: {agency.city}</p>
                                    </div>
                                </div>
                                <Badge variant="default" className="text-xs">
                                    "Activo"
                                </Badge>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground">
                                        Dirección: <span className="font-medium text-foreground">{agency.location}</span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <PhoneCall className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground">
                                        Tel: <span className="font-medium text-foreground">{agency.phone}</span>
                                    </span>
                                </div>

                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" size="sm" onClick={() => startEdit(agency)} className="flex-1 gap-2">
                                    <Edit className="h-4 w-4" />
                                    Editar
                                </Button>


                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {agencies?.length === 0 && (
                <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No se encontraron Agencias</h3>
                    <p className="text-muted-foreground mb-4">Intenta con otra búsqueda o agrega una nueva agencia</p>
                    <Button onClick={() => {
                        setSearchParams(prev => {
                            prev.set(viewCurrent, 'add')
                            return prev;
                        })
                    }} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Agregar Primer Agencia
                    </Button>
                </div>
            )}
        </div>
    )
}
