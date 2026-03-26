
import type React from "react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Phone, HousePlus, MapPinHouse } from "lucide-react"
import { useDashboard } from "../../auth/context/DashBoardContext"
import { useAuth } from "../../auth/context/AuthContext"
import Loader from "./Loader"
import { estadosMexico } from "../../shared/constants/constants"




const initialStateAgency: Agency = {
    location: "",
    name: "",
    phone: "",
    city: "",
    isCurrent: 0
}

interface Props {
    editingAgency?: Agency | null;
    onCancel?: () => void;
    configInitial?: boolean;
}
export default function AgencieForm({ editingAgency, onCancel, configInitial = false }: Props) {

    const { isLoading, handleRegisterAgency, agency } = useDashboard();
    const [formData, setFormData] = useState<Agency>(() => {
        if (configInitial && agency) return agency;
        if (editingAgency) return editingAgency;
        return initialStateAgency;
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await handleRegisterAgency({ ...formData, isCurrent: configInitial ? 1 : 0 }, configInitial);

    }

    const handleChange = (field: keyof Agency, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

console.log('agencieForm',formData);



    return (
        <Card className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm transition-colors overflow-hidden">
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
                  
                    <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                            <MapPinHouse className="h-4 w-4 text-primary" />
                            Ciudad
                        </Label>
                        <Select value={formData.city} onValueChange={(value) => handleChange('city', value)} required>
                            <SelectTrigger className="h-11 w-full">
                                <SelectValue placeholder="Selecciona ubicación de la agencia" />
                            </SelectTrigger>
                            <SelectContent>
                                {estadosMexico.map((city) => (
                                    <SelectItem key={city.id} value={city.name}>
                                        {city.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="location">
                            <MapPinHouse size={15} />
                            Ubicación <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="location"
                            type="tel"
                            placeholder="ej: calle Allende 22, Col. Centro"
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

                    <div className="flex gap-3 pt-4">
                        {onCancel && <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="flex-1 h-11 bg-transparent"
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        }
                        <Button type="submit" className="flex-1 h-11" disabled={isLoading || Object.values(formData).includes('')}>
                            {isLoading ?
                                <Loader message="Estamos guardando la información de la agencia" />
                                : editingAgency ? "Guardar cambios" : "Registrar"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
