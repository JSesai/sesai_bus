import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { ShieldOff, RefreshCw } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function LicenseExpired() {
  const navigation = useNavigate();

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-3 text-center pb-6">
        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-xl flex items-center justify-center">
          <ShieldOff className="w-10 h-10 text-destructive" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-balance">Licencia Expirada</CardTitle>
          <CardDescription className="text-base text-balance">
            Tu licencia de uso ha caducado. El sistema no puede continuar.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground text-center leading-relaxed">
          Para continuar usando el sistema, necesitas una nueva licencia válida. Contacta al administrador para obtener una.
        </div>

        <Button
          className="w-full h-11 text-base font-medium"
          onClick={() => navigation("/auth/license")}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Ingresar nueva licencia
        </Button>
      </CardContent>
    </Card>
  )
}
