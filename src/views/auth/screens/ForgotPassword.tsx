import type React from "react"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bus, ArrowLeft, Shield } from "lucide-react"
import { NavLink } from "react-router-dom"

export default function ForgotPassword() {


    const [step, setStep] = useState<"request" | "verify">("request")
    const [username, setUsername] = useState("")
    const [phone, setPhone] = useState("")
    const [code, setCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulación de envío de código
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setIsLoading(false)
        setStep("verify")
    }

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulación de verificación de código
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setIsLoading(false)
        // Aquí redirigirías al usuario a la página de nueva contraseña
        alert("Código verificado correctamente")
    }

    const handleBack = () => {
        setStep("request")
        setCode("")
    }

    return (
        <div className="from-primary/5 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
               

                <Card className="border-border shadow-lg">
                    <div className="text-center border-b">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
                            <Bus className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">TransPortes Express</h1>
                        <p className="text-muted-foreground text-balance">Viajamos contigo, siempre seguros</p>
                    </div>
                    <CardHeader className="space-y-2">
                        {step === "verify" && (
                            <Button variant="ghost" size="sm" onClick={handleBack} className="w-fit -ml-2 mb-2">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver
                            </Button>
                        )}
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            <CardTitle>{step === "request" ? "Recuperar Contraseña" : "Verificar Código"}</CardTitle>
                        </div>
                        <CardDescription>
                            {step === "request"
                                ? "Ingresa tu información para recibir un código de verificación"
                                : `Hemos enviado un código de verificación al número ${phone.replace(/(\d{3})(\d{3})(\d{4})/, "***-***-$3")}`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {step === "request" ? (
                            <form onSubmit={handleRequestCode} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-foreground font-medium">
                                        Nombre de Usuario
                                    </Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="usuario123"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="h-11"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-foreground font-medium">
                                        Número Telefónico
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+52 00-00-00-00"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        minLength={10}
                                        required
                                        className="h-11"
                                        disabled={isLoading}
                                    />
                                    <p className="text-xs text-muted-foreground">Recibirás un código SMS a este número</p>
                                </div>

                                <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
                                    {isLoading ? "Enviando código..." : "Enviar Código de Verificación"}
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyCode} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="code" className="text-foreground font-medium">
                                        Código de Verificación
                                    </Label>
                                    <Input
                                        id="code"
                                        type="text"
                                        placeholder="000000"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        required
                                        maxLength={6}
                                        className="h-11 text-center text-2xl font-semibold tracking-widest"
                                        disabled={isLoading}
                                    />
                                    <p className="text-xs text-muted-foreground text-center">
                                        Ingresa el código de 6 dígitos que recibiste
                                    </p>
                                </div>

                                <div className="flex items-center justify-center gap-2 text-sm">
                                    <span className="text-muted-foreground">¿No recibiste el código?</span>
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="p-0 h-auto font-semibold"
                                        onClick={() => {
                                            // Reenviar código
                                            alert("Código reenviado")
                                        }}
                                    >
                                        Reenviar
                                    </Button>
                                </div>

                                <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading || code.length !== 6}>
                                    {isLoading ? "Verificando..." : "Verificar Código"}
                                </Button>
                            </form>
                        )}

                        <div className="mt-6 pt-6 border-t border-border text-center">
                            <p className="text-sm text-muted-foreground">
                                ¿Recordaste tu contraseña?{" "}
                                <NavLink to="/auth/login" className="text-primary font-semibold hover:underline">
                                    Iniciar sesión
                                </NavLink>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer de seguridad */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                        <Shield className="w-3 h-3" />
                        Tu información está protegida con encriptación de extremo a extremo
                    </p>
                </div>
            </div>
        </div>
    )


}




