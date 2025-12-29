import type React from "react";
import { useState } from "react";
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Bus, Shield } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"


export default function ForgotPassword() {

    const { forgotPassword, loading } = useAuth();
    const [username, setUsername] = useState("")


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await forgotPassword(username)
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

                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            <CardTitle>Recuperar Contraseña</CardTitle>
                        </div>
                        <CardDescription>
                            Ingresa tu nombre de usuario para poder cambiar la cotraseña
                        </CardDescription>
                    </CardHeader>
                    <CardContent>

                        <form onSubmit={handleSubmit} className="space-y-5">
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
                                    disabled={loading}
                                />
                            </div>

                            <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
                                Continuar
                            </Button>
                        </form>


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




