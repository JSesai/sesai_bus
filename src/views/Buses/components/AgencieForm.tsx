



import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { MapPin, Calendar, Users, Minus, Plus, ArrowRight, CheckCircle2, Repeat, Ticket, Phone, HousePlus, MapPinHouse } from "lucide-react"
import { useDashboard } from "../../auth/context/DashBoardContext"
import { useAuth } from "../../auth/context/AuthContext"




const initialStateAgency: Agency = {
    location: "",
    name: "",
    phone: ""
}

export default function AgencieForm({ editingAgency }: { editingAgency?: boolean }) {

    const { userLogged } = useAuth();
    const { isLoading, handleRegisterAgency } = useDashboard();
    const [formData, setFormData] = useState<Agency>(initialStateAgency)



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const addAgency = await handleRegisterAgency(formData, editingAgency);
        if(addAgency) setFormData(initialStateAgency);

    }

    const handleChange = (field: keyof Agency, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    useEffect(() => {
        if (userLogged?.role === 'developer') {
            setFormData({
                name: 'Agencia - develop',
                location: 'En desarrollo',
                phone: '5522552255'
            })
        }

    }, [])


    return (
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-semibold text-balance">Configuración de agencia</CardTitle>
                <CardDescription className="text-base text-balance">
                    {editingAgency ? 'Edita' : 'Ingresa'} la información de la agencia
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-3">
                        <Label htmlFor="nombre">
                            <HousePlus size={15} />
                            Nombre <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="nombre"
                            type="text"
                            placeholder="Ej: Agencia CDMX - Revolución"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            maxLength={80}
                        />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="location">
                            <MapPinHouse size={15} />
                            Ubicación <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="location"
                            type="tel"
                            placeholder="ej: 5512345678"
                            value={formData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                            maxLength={200}
                        />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="telefono">
                            <Phone size={15} />
                            Teléfono <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="telefono"
                            type="tel"
                            placeholder="ej: 5512345678"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            maxLength={10}
                        />
                    </div>



                    <Button
                        type="submit"
                        className="w-full h-12 text-base font-medium"
                        disabled={isLoading || Object.values(formData).includes('')}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                Procesando reserva...
                            </span>
                        ) : (
                            editingAgency ? "Guardar cambios" : "Enviar"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
