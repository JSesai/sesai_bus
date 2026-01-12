import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { MapPin, MapIcon, Phone, DollarSign, Clock } from "lucide-react"
import { useDashboard } from "../../auth/context/DashBoardContext"
import { useAuth } from "../../auth/context/AuthContext"
import { useSearchParams } from "react-router-dom"



type DestinoFormProps = {
  initialData?: Route;
  onCancel?: () => void
  isEditing?: boolean;
}



const initialStateForm: Route = {
  terminalName: "",
  cityName: "",
  address: "",
  contactPhone: "",
  distanceFromOriginKm: 0,
  baseFare: 0,
  estimatedTravelTime: "",
  remarks: "",
  origin: ""
}

export default function DestinoForm({ initialData, onCancel, isEditing = false }: DestinoFormProps) {

  const [searchParams, setSearchParams] = useSearchParams();
  const { agency, isLoading, handleRegisterRoute } = useDashboard();
  const { userLogged } = useAuth();

  const [formData, setFormData] = useState<Route>(initialData ?? initialStateForm)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const registerDestination = await handleRegisterRoute(formData, isEditing);
    if (registerDestination){
      setFormData(initialStateForm);
      setSearchParams(prev => {
        prev.set('viewAtDestination', 'list')
        return prev;
      })

    } 

  }

  const handleChange = (field: keyof Route, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }


  useEffect(() => {

    if (userLogged?.role === 'developer' && !initialData) {
      setFormData({
        cityName: 'Oaxaca',
        address: 'av Reforma 222',
        contactPhone: '5522552255',
        baseFare: 250,
        origin: agency?.city || "city",
        distanceFromOriginKm: 100,
        estimatedTravelTime: '8',
        terminalName: 'terminal periferico',
        remarks: 'Inicia servicio de atención a las 11:00 am'
      })
    }

  }, [])


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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-sm font-medium">
                Nombre de la terminal destino <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nombre"
                  type="text"
                  placeholder="ej: Terminal Revolución"
                  value={formData.terminalName}
                  onChange={(e) => handleChange("terminalName", e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado" className="text-sm font-medium">
                Estado / Región del destino <span className="text-destructive">*</span>
              </Label>
              <Input
                id="estado"
                type="text"
                placeholder="ej: Ciudad de México"
                value={formData.cityName}
                onChange={(e) => handleChange("cityName", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccionTerminal" className="text-sm font-medium">
              Dirección de la terminal <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <MapIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="direccionTerminal"
                type="text"
                placeholder="ej: Av. Principal 1234, Col. Centro"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono" className="text-sm font-medium">
              Teléfono de contacto <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="telefono"
                type="tel"
                placeholder="ej: 5555551234"
                value={formData.contactPhone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "")
                  handleChange("contactPhone", value)
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
                value={formData.distanceFromOriginKm}
                onChange={(e) => handleChange("distanceFromOriginKm", Number.parseFloat(e.target.value) || 0)}
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
                  value={formData.baseFare}
                  onChange={(e) => handleChange("baseFare", Number.parseFloat(e.target.value) || 0)}
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
                  placeholder="ej: 7h 30m"
                  value={formData.estimatedTravelTime}
                  onChange={(e) => handleChange("estimatedTravelTime", e.target.value)}
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
              placeholder="ej: Horarios de atención, servicios disponibles en la terminal, información de contacto adicional..."
              value={formData.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
              disabled={isLoading}
              rows={3}
              className="resize-none"
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
              ) : isEditing ? "Actualizar destino" : "Agregar destino"
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
