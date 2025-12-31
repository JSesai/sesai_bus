import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Switch } from "../../components/ui/switch"
import { MapPin, AlertCircle, MapIcon, Phone, DollarSign, Clock } from "lucide-react"

type DestinoData = {
  nombre: string
  estado: string
  direccionTerminal: string
  telefono: string
  distanciaKm: number
  precioBase: number
  tiempoEstimado: string
  activo: boolean
  notas: string
}

type DestinoFormProps = {
  initialData?: DestinoData
  onSubmit: (data: DestinoData) => void
  onCancel: () => void
  isEditing?: boolean
}

export default function DestinoForm({ initialData, onSubmit, onCancel, isEditing = false }: DestinoFormProps) {
  const [formData, setFormData] = useState<DestinoData>(
    initialData || {
      nombre: "",
      estado: "",
      direccionTerminal: "",
      telefono: "",
      distanciaKm: 0,
      precioBase: 0,
      tiempoEstimado: "",
      activo: true,
      notas: "",
    },
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    // Validaciones
    if (
      !formData.nombre ||
      !formData.estado ||
      !formData.direccionTerminal ||
      !formData.telefono ||
      !formData.tiempoEstimado
    ) {
      setError("Por favor completa todos los campos obligatorios")
      setIsLoading(false)
      return
    }

    if (formData.telefono.length < 10) {
      setError("El telΓ©fono debe tener al menos 10 dΓ­gitos")
      setIsLoading(false)
      return
    }

    if (formData.distanciaKm < 0) {
      setError("La distancia no puede ser negativa")
      setIsLoading(false)
      return
    }

    if (formData.precioBase < 0) {
      setError("El precio base no puede ser negativo")
      setIsLoading(false)
      return
    }

    // SimulaciΓ³n de guardado - AquΓ­ integrarΓ­as tu API
    setTimeout(() => {
      setSuccess(true)
      setIsLoading(false)
      setTimeout(() => {
        onSubmit(formData)
      }, 1000)
    }, 1000)
  }

  const handleChange = (field: keyof DestinoData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
    setSuccess(false)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="space-y-3 text-center pb-6">
        <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-xl flex items-center justify-center">
          <MapPin className="w-10 h-10 text-green-600" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-balance">
            {isEditing ? "Editar Destino" : "Agregar Nuevo Destino"}
          </CardTitle>
          <CardDescription className="text-base text-balance">
            {isEditing ? "Actualiza la información del destino" : "Registra una nueva ciudad o ruta disponible"}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-600 bg-green-50 dark:bg-green-950/20">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-400">
                {isEditing ? "Destino actualizado exitosamente" : "Destino registrado exitosamente en el sistema"}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-sm font-medium">
                Nombre del destino <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Ciudad de MΓ©xico"
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado" className="text-sm font-medium">
                Estado / Región <span className="text-destructive">*</span>
              </Label>
              <Input
                id="estado"
                type="text"
                placeholder="Ciudad de MΓ©xico"
                value={formData.estado}
                onChange={(e) => handleChange("estado", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccionTerminal" className="text-sm font-medium">
              DirecciΓ³n de la terminal <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <MapIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="direccionTerminal"
                type="text"
                placeholder="Av. Principal 1234, Col. Centro"
                value={formData.direccionTerminal}
                onChange={(e) => handleChange("direccionTerminal", e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono" className="text-sm font-medium">
              TelΓ©fono de contacto <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="telefono"
                type="tel"
                placeholder="5555551234"
                value={formData.telefono}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "")
                  handleChange("telefono", value)
                }}
                className="pl-10"
                required
                disabled={isLoading}
                maxLength={10}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="distanciaKm" className="text-sm font-medium">
                Distancia (km) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="distanciaKm"
                type="number"
                placeholder="550"
                value={formData.distanciaKm}
                onChange={(e) => handleChange("distanciaKm", Number.parseFloat(e.target.value) || 0)}
                required
                disabled={isLoading}
                min="0"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precioBase" className="text-sm font-medium">
                Precio base ($) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="precioBase"
                  type="number"
                  placeholder="850"
                  value={formData.precioBase}
                  onChange={(e) => handleChange("precioBase", Number.parseFloat(e.target.value) || 0)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tiempoEstimado" className="text-sm font-medium">
                Tiempo estimado <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="tiempoEstimado"
                  type="text"
                  placeholder="7h 30m"
                  value={formData.tiempoEstimado}
                  onChange={(e) => handleChange("tiempoEstimado", e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas" className="text-sm font-medium">
              Notas adicionales
            </Label>
            <Textarea
              id="notas"
              placeholder="Ej: Horarios de atención, servicios disponibles en la terminal, información de contacto adicional..."
              value={formData.notas}
              onChange={(e) => handleChange("notas", e.target.value)}
              disabled={isLoading}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="activo" className="text-sm font-medium">
                Estado del destino
              </Label>
              <p className="text-xs text-muted-foreground">
                {formData.activo ? "Este destino estΓ' activo y disponible" : "Este destino estΓ' inactivo"}
              </p>
            </div>
            <Switch
              id="activo"
              checked={formData.activo}
              onCheckedChange={(checked) => handleChange("activo", checked)}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 bg-transparent"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 h-11 text-base font-medium" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {isEditing ? "Actualizando..." : "Guardando..."}
                </span>
              ) : isEditing ? (
                "Actualizar destino"
              ) : (
                "Agregar destino"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
