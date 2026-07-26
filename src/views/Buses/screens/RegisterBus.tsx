import type React from "react";
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { CreditCard, Hash, Users, Calendar, Accessibility } from "lucide-react"
import { useDashboard } from "../../auth/context/DashBoardContext"
import { useSearchParams } from "react-router-dom";
import { AmenitySelector } from "../components/AmenitySelector"


const initialStateBus: Bus = {
    model: "",
    // number: "",
    plate: "",
    seatingCapacity: 0,
    inapamSeats: 0,
    serialNumber: "",
    year: "",
    characteristics: "",
    status: "active",
}

export default function RegisterBus({ editingBus }: { editingBus?: Bus | null }) {

    const [_, setSearchParams] = useSearchParams();
    const { handleRegisterBus, isLoading } = useDashboard();
    const [formData, setFormData] = useState<Bus>(editingBus ? editingBus : initialStateBus);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const registerSucces = await handleRegisterBus(formData, Boolean(editingBus));
        if (!registerSucces) return;

        setFormData(initialStateBus);
        setSearchParams(prev => {
            prev.set('view', 'list')
            return prev;
        })
    }

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }


    return (
        <Card className="bg-card text-card-foreground border border-border transition-colors overflow-hidden">
            <CardHeader className="space-y-3 text-center pb-6">

                <div className="space-y-1">
                    <CardTitle className="text-2xl font-semibold text-balance">Registro de Vehículo</CardTitle>
                    <CardDescription className="text-base text-balance">Agrega un nuevo registro a la flota</CardDescription>
                </div>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="numeroAutobus" className="text-sm font-medium">
                                Número de serie <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="serialNumber"
                                    type="text"
                                    placeholder="ej: 3VWDX7AJ9CM123456"
                                    value={formData.serialNumber}
                                    onChange={(e) => handleChange("serialNumber", e.target.value.toUpperCase())}
                                    className="pl-10 uppercase"
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
                                    placeholder="ej: ABC-123-XYZ"
                                    value={formData.plate}
                                    onChange={(e) => handleChange("plate", e.target.value.toUpperCase())}
                                    className="pl-10 uppercase"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>



                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                            <Label htmlFor="inapamSeats" className="text-sm font-medium">
                                Asientos INAPAM
                            </Label>
                            <div className="relative">
                                <Accessibility className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="inapamSeats"
                                    type="number"
                                    placeholder="0"
                                    value={formData.inapamSeats}
                                    onChange={(e) => handleChange("inapamSeats", e.target.value)}
                                    className="pl-10"
                                    disabled={isLoading}
                                    min="0"
                                    max={formData.seatingCapacity}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Asientos reservados para tercera edad
                            </p>
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
                        <Label className="text-sm font-medium">
                            Amenidades del vehículo
                        </Label>
                        <AmenitySelector
                            value={formData.characteristics ?? ""}
                            onChange={(val) => setFormData((prev) => ({ ...prev, characteristics: val }))}
                            disabled={isLoading}
                        />
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
