import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Settings, Save } from "lucide-react";
import { toast } from "sonner";

export default function GeneralSetting() {
  const [minAdvanceMinutes, setMinAdvanceMinutes] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    window.electron.appConfig.getAppConfig().then((res) => {
      if (res.ok && res.data) {
        setMinAdvanceMinutes(res.data.min_advance_minutes ?? 30);
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
    setIsSaving(true);
    try {
      const res = await window.electron.appConfig.updateAppConfig({ min_advance_minutes: minAdvanceMinutes });
      if (res.ok) {
        toast.success("Configuración guardada", {
          description: `Se requiere al menos ${minAdvanceMinutes} minutos de anticipación para crear salidas del día de hoy`,
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
        <Button onClick={handleSave} disabled={isSaving} className="h-11">
          <Save size={16} className="mr-2" />
          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
      </CardContent>
    </Card>
  );
}
