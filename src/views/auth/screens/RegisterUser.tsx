import type React from "react"
import { useAuth } from "../context/AuthContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Bus, Lock, User as UserIcon, Eye, EyeOff, Phone, UserCircle } from "lucide-react"

export interface UserRegister extends User {
    confirmPassword: string;
}

const dataInicialForm: UserRegister = {
    name: "",
    userName: "",
    password: "temporal123",
    confirmPassword: "temporal123",
    phone: "",
    role: null,
    status: "registered"
}

export default function RegisterUser() {
    const { handleRegisterUser, loading, setLoading, getUniqueUserName } = useAuth();

    const [formData, setFormData] = useState<UserRegister>(dataInicialForm)
    // const [showPassword, setShowPassword] = useState(false)
    // const [showConfirmPassword, setShowConfirmPassword] = useState(false)


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()


        setLoading(true)

        const resp = await handleRegisterUser(formData);
        if (!resp) return;
        setFormData(dataInicialForm);

    }

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));


    }

    const handleKeyDown = () => {

    }

    //debounce para busqueda de nombre valido
    useEffect(() => {

        const idTimeout = setTimeout(async () => {
            //busqueda
            const userName = await getUniqueUserName(formData.name);
            console.log(userName);

            setFormData(prev => ({ ...prev, userName }));

        }, 800);

        return () => {
            clearTimeout(idTimeout)
        }


    }, [formData.name])

    return (
        <Card className="w-92 max-w-md shadow-lg">
            <CardHeader className="space-y-3 text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                    <Bus className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-semibold text-balance">Registro de Personal</CardTitle>
                    <CardDescription className="text-base text-balance">Crea una nueva cuenta de empleado</CardDescription>
                </div>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="space-y-2">
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
                                onChange={(e) => handleChange("name", e.target.value)}
                                onKeyDown={handleKeyDown}
                                minLength={10}
                                className="pl-10"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="usuario" className="text-sm font-medium">
                            Nombre de usuario
                        </Label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="usuario"
                                type="text"
                                placeholder="usuario"
                                value={formData.userName}
                                onChange={(e) => handleChange("userName", e.target.value)}
                                className="pl-10"
                                required
                                disabled={true}
                            />
                        </div>
                    </div>

                    {/* <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">
                            Contraseña
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="ingresa la contraseña"
                                value={formData.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                                className="pl-10 pr-10"
                                required
                                disabled={loading}
                                maxLength={33}
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
                    </div> */}

                    {/* <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirmar contraseña
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="confirma la contraseña"
                                value={formData.confirmPassword}
                                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                className="pl-10 pr-10"
                                required
                                maxLength={33}
                                disabled={loading}
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
                    </div> */}

                    <div className="space-y-2">
                        <Label htmlFor="telefono" className="text-sm font-medium">
                            Teléfono
                        </Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="telefono"
                                type="tel"
                                placeholder="5512345678"
                                value={formData.phone}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "")
                                    handleChange("phone", value)
                                }}
                                className="pl-10"
                                required
                                disabled={loading}
                                maxLength={10}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role" className="text-sm font-medium">
                            Rol
                        </Label>
                        <Select value={formData.role || ''} onValueChange={(value) => handleChange("role", value)} disabled={loading}>
                            <SelectTrigger id="role" className="w-full">
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ticketSeller">Taquillero</SelectItem>
                                <SelectItem value="manager">Encargado</SelectItem>
                                <SelectItem value="driver">Chofer</SelectItem>
                                <SelectItem value="checkIn">Checador</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" className="w-full h-11 text-base font-medium" disabled={loading || !formData.userName}>
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                Registrando...
                            </span>
                        ) : (
                            "Registrar empleado"
                        )}
                    </Button>


                </form>
            </CardContent>
        </Card>
    )
}
