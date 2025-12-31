
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { MapPin, Plus, Search, Edit, Trash2, ArrowLeft, Phone, MapIcon } from "lucide-react"
import DestinoForm from "../components/DestinoForm"

// Datos de ejemplo - reemplazar con datos de tu base de datos
const initialDestinos = [
  {
    id: 1,
    nombre: "Ciudad de MΓ©xico",
    estado: "Ciudad de MΓ©xico",
    direccionTerminal: "Terminal Central del Norte, Eje Central LΓ'zaro CΓ'rdenas 4907",
    telefono: "5555551234",
    distanciaKm: 0,
    precioBase: 0,
    tiempoEstimado: "0h 0m",
    activo: true,
    notas: "Terminal principal",
  },
  {
    id: 2,
    nombre: "Guadalajara",
    estado: "Jalisco",
    direccionTerminal: "Nueva Central Camionera, Av. Dr. Roberto Michel 3000",
    telefono: "3333334567",
    distanciaKm: 550,
    precioBase: 850,
    tiempoEstimado: "7h 30m",
    activo: true,
    notas: "Segunda ciudad mΓ's importante",
  },
  {
    id: 3,
    nombre: "Monterrey",
    estado: "Nuevo LeΓ³n",
    direccionTerminal: "Central de Autobuses, Av. Colón 850",
    telefono: "8188887890",
    distanciaKm: 900,
    precioBase: 1200,
    tiempoEstimado: "11h 0m",
    activo: true,
    notas: "Capital del norte",
  },
  {
    id: 4,
    nombre: "Puebla",
    estado: "Puebla",
    direccionTerminal: "Central de Autobuses CAPU, Blvd. Norte 4222",
    telefono: "2222221234",
    distanciaKm: 130,
    precioBase: 250,
    tiempoEstimado: "2h 0m",
    activo: false,
    notas: "Temporalmente fuera de servicio",
  },
]

type Destino = (typeof initialDestinos)[0]

export default function DestinosManager() {
  const [destinos, setDestinos] = useState<Destino[]>(initialDestinos)
  const [searchTerm, setSearchTerm] = useState("")
  const [view, setView] = useState<"list" | "add" | "edit">("list")
  const [editingDestino, setEditingDestino] = useState<Destino | null>(null)

  const filteredDestinos = destinos.filter(
    (destino) =>
      destino.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destino.estado.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddDestino = (newDestino: Omit<Destino, "id">) => {
    const id = Math.max(...destinos.map((d) => d.id), 0) + 1
    setDestinos([...destinos, { ...newDestino, id }])
    setView("list")
  }

  const handleEditDestino = (updatedDestino: Omit<Destino, "id">) => {
    if (editingDestino) {
      setDestinos(destinos.map((d) => (d.id === editingDestino.id ? { ...updatedDestino, id: editingDestino.id } : d)))
      setEditingDestino(null)
      setView("list")
    }
  }

  const handleDeleteDestino = (id: number) => {
    if (confirm("ΒΏEstΓ's seguro de que deseas eliminar este destino?")) {
      setDestinos(destinos.filter((d) => d.id !== id))
    }
  }

  const handleToggleActivo = (id: number) => {
    setDestinos(destinos.map((d) => (d.id === id ? { ...d, activo: !d.activo } : d)))
  }

  const startEdit = (destino: Destino) => {
    setEditingDestino(destino)
    setView("edit")
  }

  if (view === "add") {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setView("list")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a la lista
        </Button>
        <DestinoForm onSubmit={handleAddDestino} onCancel={() => setView("list")} />
      </div>
    )
  }

  if (view === "edit" && editingDestino) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setView("list")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a la lista
        </Button>
        <DestinoForm
          initialData={editingDestino}
          onSubmit={handleEditDestino}
          onCancel={() => {
            setEditingDestino(null)
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
          <h1 className="text-3xl font-bold text-balance mb-2">Gestión de Destinos</h1>
          <p className="text-muted-foreground text-pretty">Administra las rutas y ciudades disponibles</p>
        </div>
        <Button onClick={() => setView("add")} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Agregar Destino
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por ciudad o estado..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDestinos.map((destino) => (
          <Card key={destino.id} className={`transition-all hover:shadow-md ${!destino.activo ? "opacity-60" : ""}`}>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-balance">{destino.nombre}</h3>
                    <p className="text-sm text-muted-foreground">{destino.estado}</p>
                  </div>
                </div>
                <Badge variant={destino.activo ? "default" : "secondary"} className="text-xs">
                  {destino.activo ? "Activo" : "Inactivo"}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapIcon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-muted-foreground text-pretty">{destino.direccionTerminal}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{destino.telefono}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Distancia</p>
                  <p className="font-semibold text-sm">{destino.distanciaKm} km</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Precio base</p>
                  <p className="font-semibold text-sm">${destino.precioBase}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Tiempo</p>
                  <p className="font-semibold text-sm">{destino.tiempoEstimado}</p>
                </div>
              </div>

              {destino.notas && (
                <p className="text-xs text-muted-foreground italic text-pretty border-t border-border pt-2">
                  {destino.notas}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => startEdit(destino)} className="flex-1 gap-2">
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleToggleActivo(destino.id)} className="flex-1">
                  {destino.activo ? "Desactivar" : "Activar"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteDestino(destino.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDestinos.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No se encontraron destinos</h3>
          <p className="text-muted-foreground mb-4">Intenta con otra bΓΊsqueda o agrega un nuevo destino</p>
          <Button onClick={() => setView("add")} className="gap-2">
            <Plus className="h-4 w-4" />
            Agregar Primer Destino
          </Button>
        </div>
      )}
    </div>
  )
}
