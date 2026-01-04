import type React from "react";
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { CreditCard, Hash, Users, Calendar } from "lucide-react"
import { useDashboard } from "../../auth/context/DashBoardContext"


const initialStateBus: Bus = {
    model: "",
    number: "",
    plate: "",
    seatingCapacity: 0,
    serialNumber: "",
    year: "",
    characteristics: "",
    status: "active",
}

export default function RegisterBus({ editingBus }: { editingBus: Bus | null }) {

    const { handleRegisterBus, isLoading } = useDashboard();
    const [formData, setFormData] = useState<Bus>(editingBus ? editingBus : initialStateBus);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
       
        const registerSucces = await handleRegisterBus(formData, Boolean(editingBus));
        if (registerSucces) setFormData(initialStateBus);
    }

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }


    return (
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="space-y-3 text-center pb-6">

                <div className="space-y-1">
                    <CardTitle className="text-2xl font-semibold text-balance">Registro de Autobús</CardTitle>
                    <CardDescription className="text-base text-balance">Agrega un nuevo autobús a la flota</CardDescription>
                </div>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="numeroAutobus" className="text-sm font-medium">
                                Número de autobus <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="number"
                                    type="text"
                                    placeholder="001"
                                    value={formData.number}
                                    onChange={(e) => handleChange("number", e.target.value)}
                                    className="pl-10"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="placas" className="text-sm font-medium">
                                Número de placas <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="plate"
                                    type="text"
                                    placeholder="ABC-123-XYZ"
                                    value={formData.plate}
                                    onChange={(e) => handleChange("plate", e.target.value.toUpperCase())}
                                    className="pl-10 uppercase"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="numeroSerie" className="text-sm font-medium">
                            Número de serie <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="serialNumber"
                                type="text"
                                placeholder="3VWDX7AJ9CM123456"
                                value={formData.serialNumber}
                                onChange={(e) => handleChange("serialNumber", e.target.value.toUpperCase())}
                                className="pl-10 uppercase"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="seatingCapacity" className="text-sm font-medium">
                                Capacidad de asientos <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="seatingCapacity"
                                    type="number"
                                    placeholder="42"
                                    value={formData.seatingCapacity}
                                    onChange={(e) => handleChange("seatingCapacity", e.target.value)}
                                    className="pl-10"
                                    required
                                    disabled={isLoading}
                                    min="1"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="año" className="text-sm font-medium">
                                Año <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="year"
                                    type="number"
                                    placeholder="2024"
                                    value={formData.year}
                                    onChange={(e) => handleChange("year", e.target.value)}
                                    className="pl-10"
                                    required
                                    disabled={isLoading}
                                    min="1980"
                                    max={new Date().getFullYear() + 1}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="model" className="text-sm font-medium">
                                Modelo <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="model"
                                type="text"
                                placeholder="ej: Volvo 9700"
                                value={formData.model}
                                onChange={(e) => handleChange("model", e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="characteristics" className="text-sm font-medium">
                            Características
                        </Label>
                        <Textarea
                            id="characteristics"
                            placeholder="Ej: WiFi, Aire acondicionado, Pantallas individuales, Asientos reclinables, Baño, Tomas de corriente USB..."
                            value={formData.characteristics}
                            onChange={(e) => handleChange("characteristics", e.target.value)}
                            disabled={isLoading}
                            rows={4}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            Describe las comodidades y características especiales del autobús
                        </p>
                    </div>

                    <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                {editingBus ? "Guardando cambios... " : "Registrando autobús..."}
                            </span>
                        ) : (
                            editingBus ? "Guardar cambios" : "Registrar autobús"
                        )}
                    </Button>


                </form>
            </CardContent>
        </Card>
    )
}
