"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Clock, Plus, Search, Edit, Trash2, ArrowLeft, Bus, MapPin, Calendar } from "lucide-react"
import ScheduleForm from "./ScheduleForm"
import { useDashboard } from "../../auth/context/DashBoardContext"

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
  const { numberRegisterSchedule } = useDashboard();
  const [horarios, setHorarios] = useState<Horario[]>(initialHorarios)
  const [searchTerm, setSearchTerm] = useState("")
  const [view, setView] = useState<"list" | "add" | "edit">("list")
  const [editingHorario, setEditingHorario] = useState<Horario | null>(null)

  const filteredHorarios = horarios.filter(
    (horario) =>
      horario.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      horario.destino.toLowerCase().includes(searchTerm.toLowerCase()) ||
      horario.numeroAutobus.includes(searchTerm),
  )

  const handleAddHorario = (newHorario: Omit<Horario, "id">) => {
    const id = Math.max(...horarios.map((h) => h.id), 0) + 1
    setHorarios([...horarios, { ...newHorario, id }])
    setView("list")
  }

  const handleEditHorario = (updatedHorario: Omit<Horario, "id">) => {
    if (editingHorario) {
      setHorarios(horarios.map((h) => (h.id === editingHorario.id ? { ...updatedHorario, id: editingHorario.id } : h)))
      setEditingHorario(null)
      setView("list")
    }
  }

  const handleDeleteHorario = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este horario?")) {
      setHorarios(horarios.filter((h) => h.id !== id))
    }
  }

  const handleToggleActivo = (id: number) => {
    setHorarios(horarios.map((h) => (h.id === id ? { ...h, activo: !h.activo } : h)))
  }

  const startEdit = (horario: Horario) => {
    setEditingHorario(horario)
    setView("edit")
  }

  if (view === "add") {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setView("list")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a la lista
        </Button>
        <ScheduleForm onSubmit={handleAddHorario} onCancel={() => setView("list")} />
      </div>
    )
  }

  if (view === "edit" && editingHorario) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setView("list")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a la lista
        </Button>
        <ScheduleForm
          initialData={editingHorario}
          onSubmit={handleEditHorario}
          onCancel={() => {
            setEditingHorario(null)
            setView("list")
          }}
          isEditing
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance mb-2">Gestión de Horarios</h1>
          <p className="text-muted-foreground text-pretty">Administra los horarios y salidas disponibles</p>
        </div>
        {configInitial ??
          <Button onClick={() => setView("add")} size="lg" className="gap-2">
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
            placeholder="Buscar por origen, destino o autobΓΊs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
      }

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredHorarios.map((horario) => (
          <Card key={horario.id} className={`transition-all hover:shadow-md ${!horario.activo ? "opacity-60" : ""}`}>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-balance">
                      {horario.origen} → {horario.destino}
                    </h3>
                    <p className="text-sm text-muted-foreground">Salida: {horario.horaSalida}</p>
                  </div>
                </div>
                <Badge variant={horario.activo ? "default" : "secondary"} className="text-xs">
                  {horario.activo ? "Activo" : "Inactivo"}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">
                    Origen: <span className="font-medium text-foreground">{horario.origen}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">
                    Destino: <span className="font-medium text-foreground">{horario.destino}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Bus className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">
                    AutobΓΊs: <span className="font-medium text-foreground">#{horario.numeroAutobus}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">
                    Llegada: <span className="font-medium text-foreground">{horario.horaLlegada}</span>
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <div className="flex items-start gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Días de operación:</p>
                    <div className="flex flex-wrap gap-1">
                      {horario.diasOperacion.map((dia) => (
                        <Badge key={dia} variant="outline" className="text-xs">
                          {dia}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Precio</p>
                  <p className="text-xl font-bold text-green-600">${horario.precio}</p>
                </div>
              </div>

              {horario.notas && (
                <p className="text-xs text-muted-foreground italic text-pretty border-t border-border pt-2">
                  {horario.notas}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => startEdit(horario)} className="flex-1 gap-2">
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleToggleActivo(horario.id)} className="flex-1">
                  {horario.activo ? "Desactivar" : "Activar"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteHorario(horario.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHorarios.length === 0 && (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No se encontraron horarios</h3>
          <p className="text-muted-foreground mb-4">Intenta con otra bΓΊsqueda o agrega un nuevo horario</p>
          <Button onClick={() => setView("add")} className="gap-2">
            <Plus className="h-4 w-4" />
            Agregar Primer Horario
          </Button>
        </div>
      )}
    </div>
  )
}
