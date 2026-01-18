import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Checkbox } from "../../components/ui/checkbox"
import { Clock, MapPin, Bus, Calendar, DollarSign, BusFront, BubblesIcon, PanelTopOpen, ListOrdered } from "lucide-react"
import { useDashboard } from "../../auth/context/DashBoardContext"
import { useSearchParams } from "react-router-dom"
import { ScheduleError } from "../../../shared/errors/customError"



type HorarioFormData = {
  origen: string
  destino: string
  horaSalida: string
  horaLlegada: string
  numeroAutobus: string
  diasOperacion: string[]
  precio: number
  activo: boolean
  notas: string
}

type HorarioFormProps = {
  initialData?: HorarioFormData
  onSubmit: (data: HorarioFormData) => void
  onCancel: () => void
  isEditing?: boolean
}

export default function HorarioForm({ initialData, onSubmit, onCancel, isEditing = false }: HorarioFormProps) {

  const [searchParams, setSearchParams] = useSearchParams();
  const { agency, destinations, vehicles } = useDashboard();

  const [formData, setFormData] = useState<HorarioFormData>(
    initialData || {
      origen: "",
      destino: "",
      horaSalida: "",
      horaLlegada: "",
      numeroAutobus: "",
      diasOperacion: [],
      precio: 0,
      activo: true,
      notas: "",
    },
  )

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // SimulaciΓ³n de guardado
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSubmit(formData)
    setIsLoading(false)
  }

  const toggleDia = (dia: string) => {
    setFormData((prev) => ({
      ...prev,
      diasOperacion: prev.diasOperacion.includes(dia)
        ? prev.diasOperacion.filter((d) => d !== dia)
        : [...prev.diasOperacion, dia],
    }))
  }

  if (!agency) throw new ScheduleError("No se encontro registro de agencia")

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Clock className="h-6 w-6 text-cyan-500" />
          {isEditing ? "Editar Horario" : "Agregar Nuevo Horario"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="horaSalida" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Origen
              </Label>
              <Input
                id="horaSalida"
                type="text"
                value={`${agency.city} - ${agency.name}`}
                className="h-11"
                required
                disabled
              />
            </div>


            <div className="space-y-2">
              <Label htmlFor="destino" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Destino
              </Label>
              <Select value={formData.destino} onValueChange={(value) => setFormData({ ...formData, destino: value })}>
                <SelectTrigger id="destino" className="w-full py-5">
                  <SelectValue placeholder="Seleccionar destino" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((destino) => (
                    <SelectItem key={destino.id} value={destino.terminalName}>
                      {destino.cityName}{' - '}{destino.terminalName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="horaSalida" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Hora de Salida
              </Label>
              <Input
                id="horaSalida"
                type="time"
                value={formData.horaSalida}
                defaultValue={'10:00'}
                onChange={(e) => {
                  console.log(formData);

                  console.log({ horaSalida: e.target.value });

                  setFormData({ ...formData, horaSalida: e.target.value })
                }}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horaLlegada" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Hora de Llegada
              </Label>
              <Input
                id="horaLlegada"
                type="time"
                value={formData.horaLlegada}
                onChange={(e) => {
                  console.log(e.target.value);

                  setFormData({ ...formData, horaLlegada: e.target.value })
                }}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroAutobus" className="flex items-center gap-2">
                <Bus className="h-4 w-4 text-muted-foreground" />
                Autobús
              </Label>
              <Select
                value={formData.numeroAutobus}
                onValueChange={(value) => setFormData({ ...formData, numeroAutobus: value })}
              >
                <SelectTrigger id="numeroAutobus" className="py-5  w-full">
                  <SelectValue placeholder="Seleccionar autobús" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.model}>
                      {vehicle.model} {' '}{vehicle.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio" className="flex items-center gap-2">
                <ListOrdered size={15} />
                Número de Autobús
              </Label>
              <Input
                id="precio"
                type="number"
                min="0"
                step="0.01"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: Number.parseFloat(e.target.value) || 0 })}
                className="h-11"
                required
              />
            </div>

          </div>


          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 h-11" disabled={isLoading}>
              {isLoading ? "Guardando..." : isEditing ? "Actualizar Horario" : "Crear Horario"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-11 bg-transparent"
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
