"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Clock, Plus, Search, Edit, Trash2, ArrowLeft, Bus, MapPin, Calendar } from "lucide-react"
import ScheduleForm from "./ScheduleForm"
import { useDashboard } from "../../auth/context/DashBoardContext"
import { useSearchParams } from "react-router-dom"

// Datos de ejemplo - reemplazar con datos de tu base de datos
const initialHorarios = [
  {
    id: 1,
    origen: "Ciudad de MΓ©xico",
    destino: "Guadalajara",
    horaSalida: "08:00",
    horaLlegada: "15:30",
    numeroAutobus: "101",
    diasOperacion: ["Lunes", "MiΓ©rcoles", "Viernes"],
    precio: 850,
    activo: true,
    notas: "Servicio ejecutivo con Wi-Fi",
  },
  {
    id: 2,
    origen: "Ciudad de MΓ©xico",
    destino: "Monterrey",
    horaSalida: "22:00",
    horaLlegada: "09:00",
    numeroAutobus: "205",
    diasOperacion: ["Lunes", "Martes", "MiΓ©rcoles", "Jueves", "Viernes"],
    precio: 1200,
    activo: true,
    notas: "Servicio nocturno",
  },
  {
    id: 3,
    origen: "Guadalajara",
    destino: "Ciudad de MΓ©xico",
    horaSalida: "14:00",
    horaLlegada: "21:30",
    numeroAutobus: "102",
    diasOperacion: ["Martes", "Jueves", "SΓ'bado"],
    precio: 850,
    activo: true,
    notas: "",
  },
  {
    id: 4,
    origen: "Ciudad de MΓ©xico",
    destino: "Puebla",
    horaSalida: "10:00",
    horaLlegada: "12:00",
    numeroAutobus: "310",
    diasOperacion: ["SΓ'bado", "Domingo"],
    precio: 250,
    activo: false,
    notas: "Temporalmente suspendido",
  },
]

type Horario = (typeof initialHorarios)[0]


// poner search params para manejar las vista activa


export default function SchedulesManager({ configInitial = false }: { configInitial?: boolean }) {
  const { numberRegisterSchedule, runningSchedules } = useDashboard();
  const [searchParams, setSearchParams] = useSearchParams();

  const [departureTimeRecords, setDepartureTimeRecords] = useState<Schedule[]>(runningSchedules)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)

  const viewActiveAtSchedule = searchParams.get("viewAtSchedule") ?? "list";


  const handleDeleteHorario = (id: number) => {
    // if (confirm("¿Estás seguro de que deseas eliminar este horario?")) {
    //   setHorarios(horarios.filter((h) => h.id !== id))
    // }
  }

  const handleToggleActivo = (id: number) => {
    // setHorarios(horarios.map((h) => (h.id === id ? { ...h, activo: !h.activo } : h)))
  }

  const startEdit = (horario: Schedule) => {
    setEditingSchedule(horario)
    setSearchParams(prev => {
      prev.set('viewAtSchedule', 'edit')
      return prev;
    })
  }

  if (viewActiveAtSchedule === "add") {
    return (
      <div className="space-y-6">

        <ScheduleForm onCancel={() => {
          setSearchParams(prev => {
            prev.set('viewAtSchedule', 'list')
            return prev;
          })
        }} />
      </div>
    )
  }

  if (viewActiveAtSchedule === "edit" && editingSchedule) {
    return (
      <div className="space-y-6">

        <ScheduleForm
          isEditing
          initialData={editingSchedule}
          onCancel={() => {
            setEditingSchedule(null)
            setSearchParams(prev => {
              prev.set('viewAtSchedule', 'list')
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
          <h1 className="text-3xl font-bold text-balance mb-2">Gestión de Horarios de Salida</h1>
          <p className="text-muted-foreground text-pretty">Administra los horarios y salidas disponibles</p>
        </div>
        {numberRegisterSchedule > 0 &&
          <Button onClick={() => {
            setSearchParams(prev => {
              prev.set('viewAtSchedule', 'add')
              return prev;
            })
          }} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Agregar Horario
          </Button>

        }
      </div>

      {configInitial ??
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por origen, destino o autobús..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
      }

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departureTimeRecords.map((schedule) => (
          <Card key={schedule.id} className={`transition-all hover:shadow-md ${schedule.status === 'disabled' ? "opacity-60" : ""}`}>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-balance">
                      {schedule.agency_id_origin} → {schedule.route_id}
                    </h3>
                    <p className="text-sm text-muted-foreground">Salida: {schedule.arrival_time}</p>
                  </div>
                </div>
                <Badge variant={schedule.status === "active" ? "default" : "secondary"} className="text-xs">
                  {schedule.status === "active" ? "Activo" : "Inactivo"}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">
                    Origen: <span className="font-medium text-foreground">{schedule.agency_id_origin}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">
                    Destino: <span className="font-medium text-foreground">{schedule.route_id}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Bus className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">
                    Autobús: <span className="font-medium text-foreground">#{schedule.vehicle_number}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">
                    Llegada: <span className="font-medium text-foreground">{schedule.arrival_time}</span>
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <div className="flex items-start gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Días de operación:</p>
                    <div className="flex flex-wrap gap-1">
                      {schedule.daysOperation.map((dia) => (
                        <Badge key={dia} variant="outline" className="text-xs">
                          {dia}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => startEdit(schedule)} className="flex-1 gap-2">
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleToggleActivo(schedule.id || 0)} className="flex-1">
                  {schedule.status === "active" ? "Desactivar" : "Activar"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteHorario(schedule.id || 0)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {numberRegisterSchedule === 0 && (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No se encontraron horarios</h3>
          {configInitial ?? <p className="text-muted-foreground mb-4">Intenta con otra búsqueda o agrega un nuevo horario</p>}
          <Button onClick={() => {
            setSearchParams(prev => {
              prev.set('viewAtSchedule', 'add')
              return prev;
            })
          }} className="gap-2">
            <Plus className="h-4 w-4" />
            Agregar Primer Horario
          </Button>
        </div>
      )}
    </div>
  )
}
