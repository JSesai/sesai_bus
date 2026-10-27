import { useEffect, useState, useCallback } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Slider } from "../../components/ui/slider";
import { Switch } from "../../components/ui/switch";
import { Printer, RefreshCw, CheckCircle2, XCircle, Loader2, Save, TestTube2 } from "lucide-react";
import { toast } from "sonner";

type PrinterStatus = "checking" | "connected" | "disconnected";

const TEXT_SIZE_LABELS: Record<string, string> = {
  "1": "Normal",
  "2": "Grande",
  "3": "Extra grande",
};

const CUT_MODE_LABELS: Record<string, string> = {
  "1": "Completo",
  "2": "Parcial",
  "3": "Estándar",
};

const TEST_TICKET: TicketPrintData = {
  agencyName: "AGENCIA DE PRUEBA",
  agencyCity: "Monterrey",
  agencyPhone: "8123456789",
  origin: "Monterrey",
  destination: "Matehuala",
  date: new Date().toLocaleDateString("es-MX"),
  time: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
  passengerName: "Pasajero de prueba",
  seatNumbers: [1],
  totalAmount: 120,
  isRoundTrip: false,
  ticketIds: [0],
};

export function PrinterSettingsCard() {
  const [status, setStatus] = useState<PrinterStatus>("checking");
  const [lastChecked, setLastChecked] = useState<string>("");
  const [settings, setSettings] = useState<PrinterSettings>({
    textSize: 1,
    qrSize: 4,
    cutEnabled: true,
    cutMode: 1,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isPrintingTest, setIsPrintingTest] = useState(false);

  const check = useCallback(async () => {
    const now = new Date().toLocaleTimeString("es-MX");
    try {
      const { connected } = await window.electron.printer.checkStatus();
      setStatus(connected ? "connected" : "disconnected");
      setLastChecked(now);
    } catch {
      setStatus("disconnected");
      setLastChecked(now);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await window.electron.appConfig.getAppConfig();
        if (active && res?.data) {
          setSettings({
            textSize: Math.min(3, Math.max(1, Number(res.data.printer_text_size) || 1)) as 1 | 2 | 3,
            qrSize: Math.min(8, Math.max(2, Number(res.data.printer_qr_size) || 4)),
            cutEnabled: Number(res.data.printer_cut_enabled) !== 0,
            cutMode: Math.min(3, Math.max(1, Number(res.data.printer_cut_mode) || 1)) as 1 | 2 | 3,
          });
        }
      } catch {
        // usar valores por defecto
      }

      try {
        const { connected } = await window.electron.printer.checkStatus();
        if (active) {
          setStatus(connected ? "connected" : "disconnected");
          setLastChecked(new Date().toLocaleTimeString("es-MX"));
        }
      } catch {
        if (active) {
          setStatus("disconnected");
          setLastChecked(new Date().toLocaleTimeString("es-MX"));
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await window.electron.appConfig.updateAppConfig({
        printer_text_size: settings.textSize,
        printer_qr_size: settings.qrSize,
        printer_cut_enabled: settings.cutEnabled ? 1 : 0,
        printer_cut_mode: settings.cutMode,
      });
      if (res?.ok) {
        toast.success("Configuración de impresora guardada", { position: "top-center" });
      } else {
        toast.error("Error al guardar", { position: "top-center" });
      }
    } catch {
      toast.error("Error al guardar la configuración", { position: "top-center" });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrintTest = async () => {
    setIsPrintingTest(true);
    try {
      const result = await window.electron.printer.print(TEST_TICKET);
      if (result.method === "printer") {
        toast.success("Ticket de prueba impreso", { position: "top-center" });
      } else {
        toast.info("No se detectó impresora, se generó PDF", { position: "top-center" });
      }
    } catch {
      toast.error("Error al imprimir ticket de prueba", { position: "top-center" });
    } finally {
      setIsPrintingTest(false);
    }
  };

  const handleRecheck = () => {
    setStatus("checking");
    check();
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Printer size={28} className="text-slate-600" />
          Impresora
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-3">
          {status === "checking" && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
          {status === "connected" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
          {status === "disconnected" && <XCircle className="h-5 w-5 text-red-500" />}

          <div>
            <p className="text-lg font-semibold">
              {status === "checking" && "Verificando impresora..."}
              {status === "connected" && "Impresora conectada"}
              {status === "disconnected" && "Impresora no detectada"}
            </p>
            <p className="text-sm text-muted-foreground">
              {lastChecked ? `Última verificación: ${lastChecked}` : "Conecta la impresora térmica por USB y presiona revisar."}
            </p>
          </div>
        </div>

        <div className="border-t pt-5 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="textSize" className="text-base font-medium">
              Tamaño de letra
            </Label>
            <p className="text-sm text-muted-foreground">
              Normal usa el tamaño estándar. Grande y Extra agrandan el encabezado, el total y el cuerpo del ticket.
            </p>
            <Select
              value={String(settings.textSize)}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, textSize: Number(value) as 1 | 2 | 3 }))}
            >
              <SelectTrigger id="textSize" className="w-full h-11">
                <SelectValue placeholder="Selecciona el tamaño" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TEXT_SIZE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qrSize" className="text-base font-medium">
              Tamaño del código QR
            </Label>
            <p className="text-sm text-muted-foreground">Ajusta cuán grande se imprime el QR en el ticket.</p>
            <div className="flex items-center gap-4">
              <Slider
                value={[settings.qrSize]}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, qrSize: value[0] }))}
                min={2}
                max={8}
                step={1}
                className="flex-1"
              />
              <span className="text-lg font-bold w-8 text-center">{settings.qrSize}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Pequeño</span>
              <span>Grande</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="cutEnabled" className="text-base font-medium">
                  Auto-corte del papel
                </Label>
                <p className="text-sm text-muted-foreground">Corta el ticket automáticamente al final de la impresión.</p>
              </div>
              <Switch
                id="cutEnabled"
                checked={settings.cutEnabled}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, cutEnabled: checked }))}
              />
            </div>

            {settings.cutEnabled && (
              <Select
                value={String(settings.cutMode)}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, cutMode: Number(value) as 1 | 2 | 3 }))}
              >
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="Modo de corte" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CUT_MODE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      Corte {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground space-y-1">
          <p>• La impresora debe estar encendida y conectada por USB.</p>
          <p>• Si no la detecta, verifica que macOS la vea en Preferencias del Sistema → Impresoras y escáneres.</p>
          <p>• El ticket se genera como PDF automáticamente si no hay impresora.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSave} disabled={isSaving} className="h-11">
            <Save size={16} className="mr-2" />
            {isSaving ? "Guardando..." : "Guardar configuración"}
          </Button>
          <Button onClick={handlePrintTest} disabled={isPrintingTest || status !== "connected"} variant="outline" className="h-11">
            <TestTube2 size={16} className="mr-2" />
            {isPrintingTest ? "Imprimiendo..." : "Imprimir prueba"}
          </Button>
          <Button onClick={handleRecheck} disabled={status === "checking"} variant="ghost" className="h-11">
            <RefreshCw size={16} className="mr-2" />
            Revisar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}