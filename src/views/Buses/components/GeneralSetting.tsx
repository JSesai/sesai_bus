import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Settings, Save } from "lucide-react";
import { toast } from "sonner";
import { useDashboard } from "../../auth/context/DashBoardContext";

export default function GeneralSetting() {
  const { loadAppConfig } = useDashboard();
  const [minAdvanceMinutes, setMinAdvanceMinutes] = useState(30);
  const [serviceFeePercent, setServiceFeePercent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    window.electron.appConfig.getAppConfig().then((res) => {
      if (res.ok && res.data) {
        setMinAdvanceMinutes(res.data.min_advance_minutes ?? 30);
        setServiceFeePercent(res.data.service_fee_percent ?? 0);
      }
      setIsLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (minAdvanceMinutes < 0) {
      toast.error("Valor no válido", {
        description: "Los minutos de anticipación no pueden ser negativos",
        position: "top-center",
      });
      return;
    }
    if (serviceFeePercent < 0 || serviceFeePercent > 100) {
      toast.error("Valor no válido", {
        description: "El porcentaje de cargo por servicio debe estar entre 0 y 100",
        position: "top-center",
      });
      return;
    }
    setIsSaving(true);
    try {
      const res = await window.electron.appConfig.updateAppConfig({
        min_advance_minutes: minAdvanceMinutes,
        service_fee_percent: serviceFeePercent,
      });
      if (res.ok) {
        await loadAppConfig();
        toast.success("Configuración guardada", {
          description: `Cargo por servicio: ${serviceFeePercent}% | Anticipación: ${minAdvanceMinutes} min`,
          position: "top-center",
        });
      } else {
        toast.error("Error al guardar", { description: res.error?.detail, position: "top-center" });
      }
    } catch {
      toast.error("Error al guardar la configuración", { position: "top-center" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-40 text-muted-foreground">Cargando configuración...</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Settings size={28} className="text-slate-600" />
          Configuración General
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="minAdvance" className="text-base font-medium">
            Minutos de anticipación para salidas del día actual
          </Label>
          <p className="text-sm text-muted-foreground">
            Al crear o editar un horario de salida para el día de hoy, la hora de salida debe ser al menos esta cantidad de minutos posterior a la hora actual.
          </p>
          <div className="flex items-center gap-3 mt-3">
            <Input
              id="minAdvance"
              type="number"
              min="0"
              value={minAdvanceMinutes}
              onChange={(e) => setMinAdvanceMinutes(Number(e.target.value))}
              className="h-11 w-32"
            />
            <span className="text-sm text-muted-foreground">minutos</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceFee" className="text-base font-medium">
            Cargo por servicio
          </Label>
          <p className="text-sm text-muted-foreground">
            Porcentaje adicional que se cobra sobre el subtotal del boleto. Se muestra desglosado en el resumen de compra. Configurar en 0 para no cobrar.
          </p>
          <div className="flex items-center gap-3 mt-3">
            <Input
              id="serviceFee"
              type="number"
              min="0"
              max="100"
              value={serviceFeePercent}
              onChange={(e) => setServiceFeePercent(Number(e.target.value))}
              className="h-11 w-32"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="h-11">
          <Save size={16} className="mr-2" />
          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
      </CardContent>
    </Card>
  );
}
