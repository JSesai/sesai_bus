
import type React from "react"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Bus, Lock, User, AlertCircle, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function LoginForm() {
  const { login, loading, setLoading } = useAuth();
  const navigation = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      setError("");
      setLoading(true);
      if (!userName && !password) return setError("Por favor completa todos los campos");
      await login({ userName, password });

    } catch (error) {
      setError("No fue posible realizar la autenticacion. Intenta mas tarde");
    } finally {
      setLoading(false);
    }


  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-3 text-center pb-6">
        <div className="mx-auto w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
          <Bus className="w-10 h-10 text-primary-foreground" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-balance">Sistema de Taquilla</CardTitle>
          <CardDescription className="text-base text-balance">Acceso para personal autorizado</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Usuario
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="user"
                type="user"
                placeholder="Ingresa tu usuario"
                value={userName}
                onChange={(e) => setUserName(e.target.value.trim())}
                className="pl-10"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </Label>

            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value.trim())}
                className="pl-10 pr-10"
                required
                disabled={loading}
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

          <Button type="submit" className="w-full h-11 text-base font-medium" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Iniciando sesión...
              </span>
            ) : (
              "Iniciar sesión"
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              className="cursor-pointer text-xs text-primary hover:underline"
              onClick={() => navigation('/auth/forgot-password')}
            >
              ¿Olvidaste tu contraseña?
            </button>

          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-center text-muted-foreground leading-relaxed">
              Este sistema es de uso exclusivo para personal autorizado. El acceso no autorizado está prohibido.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

