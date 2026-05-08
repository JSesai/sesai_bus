import { Phone, UserCircle } from "lucide-react";
import { useTicket } from "../../auth/context/TicketContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { useState } from "react";
import { toCapitalCase } from "../../shared/utils/helpers";

const longitudtelefono = 10;

export default function InfoCustomer() {

    const { backgrounTiketSale } = useTicket();

    const [formData, setFormData] = useState<Customer>({
        name: "",
        phone: ""
    })

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }

    return (
        <Card className={`${backgrounTiketSale} dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm transition-colors overflow-hidden`}>
            <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-semibold text-balance">Información del cliente</CardTitle>
                <CardDescription className="text-base text-balance">
                    Ingresa los datos del pasajero principal: nombre completo y teléfono de contacto.
                </CardDescription>
            </CardHeader>

            <CardContent>

                <div className="space-y-2">
                    <Label htmlFor="telefono" className="text-sm font-medium">
                        Teléfono
                    </Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="telefono"
                            type="tel"
                            placeholder="10 dig: 5512345678"
                            value={formData.phone}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "")
                                handleChange("phone", value)
                            }}
                            className="pl-10"
                            required
                            maxLength={longitudtelefono}
                        />
                    </div>
                </div>

                <div className="space-y-2 mt-4">
                    <Label htmlFor="name" className="text-sm font-medium">
                        Nombre completo
                    </Label>
                    <div className="relative">
                        <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="nombre"
                            type="text"
                            placeholder="Ingresa nombre completo"
                            value={formData.name}
                            onChange={(e) => handleChange("name", toCapitalCase(e.target.value))}
                            minLength={10}
                            className="pl-10"
                            required
                            disabled={formData.phone.length !== longitudtelefono}

                        />
                    </div>
                </div>

            </CardContent>
        </Card >
    )
}
