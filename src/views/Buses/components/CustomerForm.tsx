import type React from "react"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Loader2 } from "lucide-react"

type ClienteFormData = {
  nombre: string
  telefono: string
  email: string
  direccion: string
  activo: boolean
}

type ClienteFormProps = {
  onSubmit: (data: ClienteFormData) => void
  onCancel: () => void
  initialData?: Partial<ClienteFormData>
  isEditing?: boolean
}

export default function ClienteForm({ onSubmit, onCancel, initialData, isEditing = false }: ClienteFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ClienteFormData>({
    nombre: initialData?.nombre || "",
    telefono: initialData?.telefono || "",
    email: initialData?.email || "",
    direccion: initialData?.direccion || "",
    activo: initialData?.activo ?? true,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ClienteFormData, string>>>({})

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ClienteFormData, string>> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El telΓ©fono es requerido"
    } else if (!/^\d{10}$/.test(formData.telefono)) {
      newErrors.telefono = "El telΓ©fono debe tener 10 dΓ­gitos"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es vΓ'lido"
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = "La direcciΓ³n es requerida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSubmit(formData)
    setIsLoading(false)
  }

  const handlePhoneChange = (value: string) => {
    const numbersOnly = value.replace(/\D/g, "").slice(0, 10)
    setFormData({ ...formData, telefono: numbersOnly })
    if (errors.telefono) {
      setErrors({ ...errors, telefono: "" })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Cliente" : "Agregar Nuevo Cliente"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Actualiza la informaciΓ³n del cliente en el sistema"
            : "Completa el formulario para registrar un nuevo cliente"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombre">
                Nombre Completo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Juan PΓ©rez GΓ³mez"
                value={formData.nombre}
                onChange={(e) => {
                  setFormData({ ...formData, nombre: e.target.value })
                  if (errors.nombre) setErrors({ ...errors, nombre: "" })
                }}
                className={errors.nombre ? "border-destructive" : ""}
              />
              {errors.nombre && <p className="text-sm text-destructive">{errors.nombre}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">
                TelΓ©fono <span className="text-destructive">*</span>
              </Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="5512345678"
                value={formData.telefono}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={errors.telefono ? "border-destructive" : ""}
                maxLength={10}
              />
              {errors.telefono && <p className="text-sm text-destructive">{errors.telefono}</p>}
              <p className="text-xs text-muted-foreground">Solo nΓΊmeros, 10 dΓ­gitos</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="cliente@email.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value })
                if (errors.email) setErrors({ ...errors, email: "" })
              }}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            <p className="text-xs text-muted-foreground">Campo opcional</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">
              DirecciΓ³n <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="direccion"
              placeholder="Av. Insurgentes 123, Col. Centro, CDMX"
              value={formData.direccion}
              onChange={(e) => {
                setFormData({ ...formData, direccion: e.target.value })
                if (errors.direccion) setErrors({ ...errors, direccion: "" })
              }}
              className={errors.direccion ? "border-destructive" : ""}
              rows={3}
            />
            {errors.direccion && <p className="text-sm text-destructive">{errors.direccion}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="activo"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              className="w-4 h-4 rounded border-input"
            />
            <Label htmlFor="activo" className="cursor-pointer">
              Cliente activo
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Guardando..." : "Registrando..."}
                </>
              ) : isEditing ? (
                "Guardar Cambios"
              ) : (
                "Registrar Cliente"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 bg-transparent"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
