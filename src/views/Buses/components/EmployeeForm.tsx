import type React from "react"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { AlertCircle, Eye, EyeOff, Lock, Phone, User, UserCircle } from "lucide-react"

type UsuarioFormData = {
  nombre: string
  usuario: string
  password: string
  confirmPassword: string
  telefono: string
  rol: string
  activo: boolean
}

type UsuarioFormProps = {
  initialData?: Partial<UsuarioFormData>
  onSubmit: (data: Omit<UsuarioFormData, "password" | "confirmPassword">) => void
  onCancel: () => void
  isEditing?: boolean
}

export default function UsuarioForm({ initialData, onSubmit, onCancel, isEditing = false }: UsuarioFormProps) {
  const [formData, setFormData] = useState<UsuarioFormData>({
    nombre: initialData?.nombre || "",
    usuario: initialData?.usuario || "",
    password: "",
    confirmPassword: "",
    telefono: initialData?.telefono || "",
    rol: initialData?.rol || "",
    activo: initialData?.activo !== undefined ? initialData.activo : true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validaciones
    if (!formData.nombre || !formData.usuario || !formData.telefono || !formData.rol) {
      setError("Por favor completa todos los campos obligatorios")
      setIsLoading(false)
      return
    }

    // Solo validar contraseña si es un nuevo usuario o si se está cambiando
    if (!isEditing || formData.password) {
      if (!formData.password) {
        setError("La contraseΓ±a es obligatoria")
        setIsLoading(false)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Las contraseΓ±as no coinciden")
        setIsLoading(false)
        return
      }

      if (formData.password.length < 6) {
        setError("La contraseΓ±a debe tener al menos 6 caracteres")
        setIsLoading(false)
        return
      }
    }

    if (formData.telefono.length < 10) {
      setError("El nΓΊmero de telΓ©fono debe tener al menos 10 dΓ­gitos")
      setIsLoading(false)
      return
    }

    // Simulación de guardado - Aquí integrarías tu API
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, confirmPassword, ...dataToSubmit } = formData
      onSubmit(dataToSubmit)
      setIsLoading(false)
    }, 1000)
  }

  const handleChange = (field: keyof UsuarioFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-semibold">
          {isEditing ? "Editar Usuario" : "Agregar Nuevo Usuario"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Actualiza la informaciΓ³n del empleado"
            : "Completa el formulario para registrar un nuevo empleado"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="nombre" className="text-sm font-medium">
                Nombre completo <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Juan PΓ©rez GarcΓ­a"
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="usuario" className="text-sm font-medium">
                Nombre de usuario <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="usuario"
                  type="text"
                  placeholder="jperez123"
                  value={formData.usuario}
                  onChange={(e) => handleChange("usuario", e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-sm font-medium">
                TelΓ©fono <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="5512345678"
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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                ContraseΓ±a {!isEditing && <span className="text-destructive">*</span>}
                {isEditing && (
                  <span className="text-xs text-muted-foreground ml-1">(Dejar vacΓ­o para no cambiar)</span>
                )}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="β€'β€'β€'β€'β€'β€'β€'β€'"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="pl-10 pr-10"
                  required={!isEditing}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar contraseΓ±a {!isEditing && <span className="text-destructive">*</span>}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="β€'β€'β€'β€'β€'β€'β€'β€'"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  className="pl-10 pr-10"
                  required={!isEditing && !!formData.password}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rol" className="text-sm font-medium">
                Rol <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.rol}
                onValueChange={(value) => handleChange("rol", value)}
                disabled={isLoading}
                required
              >
                <SelectTrigger id="rol" className="w-full">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="taquillero">Taquillero</SelectItem>
                  <SelectItem value="encargado">Encargado</SelectItem>
                  <SelectItem value="chofer">Chofer</SelectItem>
                  <SelectItem value="checador">Checador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activo" className="text-sm font-medium">
                Estado
              </Label>
              <Select
                value={formData.activo ? "activo" : "inactivo"}
                onValueChange={(value) => handleChange("activo", value === "activo")}
                disabled={isLoading}
              >
                <SelectTrigger id="activo" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-transparent"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {isEditing ? "Actualizando..." : "Guardando..."}
                </span>
              ) : isEditing ? (
                "Actualizar Usuario"
              ) : (
                "Guardar Usuario"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
