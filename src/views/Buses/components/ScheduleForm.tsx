import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Checkbox } from "../../components/ui/checkbox"
import { Clock, MapPin, Bus, Calendar, DollarSign } from "lucide-react"

const destinos = ["Ciudad de MΓ©xico", "Guadalajara", "Monterrey", "Puebla", "CancΓΊn", "Tijuana", "LeΓ³n", "Querétaro"]

const autobuses = ["101", "102", "103", "205", "206", "310", "311", "312"]

const diasSemana = ["Lunes", "Martes", "MiΓ©rcoles", "Jueves", "Viernes", "SΓ'bado", "Domingo"]

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

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Clock className="h-6 w-6 text-blue-600" />
          {isEditing ? "Editar Horario" : "Agregar Nuevo Horario"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="origen" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Origen
              </Label>
              <Select value={formData.origen} onValueChange={(value) => setFormData({ ...formData, origen: value })}>
                <SelectTrigger id="origen" className="h-11">
                  <SelectValue placeholder="Seleccionar origen" />
                </SelectTrigger>
                <SelectContent>
                  {destinos.map((destino) => (
                    <SelectItem key={destino} value={destino}>
                      {destino}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destino" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Destino
              </Label>
              <Select value={formData.destino} onValueChange={(value) => setFormData({ ...formData, destino: value })}>
                <SelectTrigger id="destino" className="h-11">
                  <SelectValue placeholder="Seleccionar destino" />
                </SelectTrigger>
                <SelectContent>
                  {destinos.map((destino) => (
                    <SelectItem key={destino} value={destino}>
                      {destino}
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
                onChange={(e) => setFormData({ ...formData, horaSalida: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, horaLlegada: e.target.value })}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroAutobus" className="flex items-center gap-2">
                <Bus className="h-4 w-4 text-muted-foreground" />
                NΓΊmero de AutobΓΊs
              </Label>
              <Select
                value={formData.numeroAutobus}
                onValueChange={(value) => setFormData({ ...formData, numeroAutobus: value })}
              >
                <SelectTrigger id="numeroAutobus" className="h-11">
                  <SelectValue placeholder="Seleccionar autobΓΊs" />
                </SelectTrigger>
                <SelectContent>
                  {autobuses.map((autobus) => (
                    <SelectItem key={autobus} value={autobus}>
                      AutobΓΊs #{autobus}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                Precio del Boleto
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

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Días de Operación
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 border border-border rounded-lg bg-muted/30">
              {diasSemana.map((dia) => (
                <div key={dia} className="flex items-center space-x-2">
                  <Checkbox
                    id={dia}
                    checked={formData.diasOperacion.includes(dia)}
                    onCheckedChange={() => toggleDia(dia)}
                  />
                  <label htmlFor={dia} className="text-sm font-medium cursor-pointer">
                    {dia}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas Adicionales</Label>
            <Textarea
              id="notas"
              placeholder="Ej: Servicio ejecutivo, Wi-Fi disponible, aire acondicionado..."
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="activo"
              checked={formData.activo}
              onCheckedChange={(checked) => setFormData({ ...formData, activo: checked === true })}
            />
            <label htmlFor="activo" className="text-sm font-medium cursor-pointer">
              Horario activo
            </label>
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
