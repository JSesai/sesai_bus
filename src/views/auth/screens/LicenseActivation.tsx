import type React from "react"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Shield, Key, AlertCircle, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function LicenseActivation() {
  const { setLoading } = useAuth();
  const navigation = useNavigate();
  const [licenseKey, setLicenseKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingLocal, setLoadingLocal] = useState(false);

  const formatKey = (value: string) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    const parts = cleaned.match(/.{1,4}/g);
    return parts ? parts.join("-") : "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatKey(raw);
    if (formatted.replace(/-/g, "").length <= 16) {
      setLicenseKey(formatted);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!licenseKey || licenseKey.replace(/-/g, "").length < 16) {
      setError("Ingresa una clave de licencia válida (16 caracteres)");
      return;
    }

    setLoadingLocal(true);
    try {
      const response = await window.electron.license.activateLicense({ licenseKey });

      if (!response.ok || !response.data?.valid) {
        setError(response.error?.detail || "No fue posible activar la licencia");
        return;
      }

      setSuccess("Licencia activada correctamente");
      setTimeout(() => {
        navigation("/auth/login");
      }, 1500);
    } catch {
      setError("Error de conexión. Verifica tu acceso a internet.");
    } finally {
      setLoadingLocal(false);
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-3 text-center pb-6">
        <div className="mx-auto w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
          <Shield className="w-10 h-10 text-primary-foreground" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-balance">Activar Licencia</CardTitle>
          <CardDescription className="text-base text-balance">
            Ingresa tu clave de licencia para activar el sistema
          </CardDescription>
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

          {success && (
            <Alert className="border-green-500 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="licenseKey" className="text-sm font-medium">
              Clave de Licencia
            </Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="licenseKey"
                type="text"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                value={licenseKey}
                onChange={handleChange}
                className="pl-10 font-mono tracking-wider"
                maxLength={19}
                required
                disabled={loadingLocal}
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-11 text-base font-medium" disabled={loadingLocal}>
            {loadingLocal ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Activando...
              </span>
            ) : (
              "Activar Licencia"
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              className="cursor-pointer text-xs text-primary hover:underline"
              onClick={() => navigation("/auth/login")}
            >
              Volver al inicio de sesión
            </button>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-center text-muted-foreground leading-relaxed">
              La licencia está vinculada a este dispositivo. Si necesitas una nueva clave, contacta al administrador.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
