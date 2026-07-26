import { useEffect, useState } from "react";
import { Monitor, MonitorOff, Link, Type, Info, QrCode } from "lucide-react";
import QRCode from "qrcode";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { useDashboard } from "../../auth/context/DashBoardContext";
import { toast } from "sonner";

const FONT_SCALES = [
  { label: "Pequeña", value: 0.85, desc: "Pantallas pequeñas / monitores" },
  { label: "Normal", value: 1, desc: "Tamaño estándar" },
  { label: "Grande", value: 1.2, desc: "TVs medianas (32-43\")" },
  { label: "Extra Grande", value: 1.45, desc: "TVs grandes (50\"+)" },
];

export default function WaitingRoomSettings() {
  const { waitingRoomOpen, toggleWaitingRoom } = useDashboard();
  const [fontScale, setFontScale] = useState(1.45);
  const [networkUrl, setNetworkUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConfig();
    loadUrl();
  }, []);

  useEffect(() => {
    if (networkUrl) {
      QRCode.toDataURL(networkUrl, { width: 200, margin: 2 })
        .then(setQrDataUrl)
        .catch(() => {});
    }
  }, [networkUrl]);

  const loadConfig = async () => {
    try {
      const res = await window.electron.waitingRoom.getConfig();
      if (res.ok && res.data) {
        setFontScale(res.data.fontScale);
      }
    } catch {}
  };

  const loadUrl = async () => {
    try {
      const res = await window.electron.waitingRoom.getUrl();
      if (res.ok && res.data) {
        setNetworkUrl(res.data.url);
      }
    } catch {}
  };

  const handleToggle = async () => {
    setLoading(true);
    await toggleWaitingRoom();
    setLoading(false);
  };

  const handleScaleChange = async (scale: number) => {
    setFontScale(scale);
    const res = await window.electron.waitingRoom.saveConfig({ fontScale: scale });
    if (res.ok) {
      toast.success("Configuración guardada", {
        description: `Escala de fuente: ${FONT_SCALES.find(s => s.value === scale)?.label}`,
        duration: 3000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Pantalla de Sala de Espera</h2>
        <p className="text-muted-foreground mt-1">
          Configura la pantalla que se proyecta en la sala de espera para los pasajeros.
        </p>
      </div>

      {/* Power toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {waitingRoomOpen ? <Monitor className="h-5 w-5 text-cyan-400" /> : <MonitorOff className="h-5 w-5 text-muted-foreground" />}
            Pantalla de Proyección
          </CardTitle>
          <CardDescription>
            Enciende o apaga la pantalla de salidas que se muestra en la sala de espera.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${waitingRoomOpen ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
              <span className="text-sm font-medium">
                {waitingRoomOpen ? "Pantalla activa" : "Pantalla apagada"}
              </span>
            </div>
            <Button
              onClick={handleToggle}
              disabled={loading}
              variant={waitingRoomOpen ? "destructive" : "default"}
              className={waitingRoomOpen ? "" : "bg-cyan-600 hover:bg-cyan-700"}
            >
              {waitingRoomOpen ? (
                <><MonitorOff className="mr-2 h-4 w-4" /> Apagar</>
              ) : (
                <><Monitor className="mr-2 h-4 w-4" /> Encender</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Font scale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Tamaño de Fuente
          </CardTitle>
          <CardDescription>
            Ajusta el tamaño del texto según el tamaño de la pantalla de proyección.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FONT_SCALES.map((scale) => (
              <button
                key={scale.value}
                onClick={() => handleScaleChange(scale.value)}
                className={`flex flex-col items-start p-4 rounded-lg border-2 transition-all text-left ${
                  fontScale === scale.value
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-border hover:border-muted-foreground/50 bg-card"
                }`}
              >
                <span className="text-sm font-semibold">{scale.label}</span>
                <span className="text-xs text-muted-foreground mt-0.5">{scale.desc}</span>
                <span className="text-xs font-mono text-muted-foreground/60 mt-1">
                  escala: {scale.value}x
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network URL + QR */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Acceso por Red
          </CardTitle>
          <CardDescription>
            Abre esta URL en el navegador de la Smart TV para proyectar la pantalla de salidas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* URL + copy */}
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                <code className="flex-1 text-sm font-mono text-foreground break-all">
                  {networkUrl || "Cargando..."}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(networkUrl);
                    toast.success("URL copiada al portapapeles");
                  }}
                  disabled={!networkUrl}
                >
                  Copiar
                </Button>
              </div>
              <div className="flex items-start gap-2 mt-3">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Abre la app de SmartThings (Samsung) o ThinQ (LG) en tu celular,
                  busca la Smart TV y abre esta URL en su navegador. También puedes
                  escanear el código QR con la cámara del celular.
                </p>
              </div>
            </div>
            {/* QR Code */}
            {qrDataUrl && (
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-white rounded-xl shadow-lg">
                  <img src={qrDataUrl} alt="QR Code" className="w-[160px] h-[160px]" />
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <QrCode className="h-3 w-3" /> Escanear con la cámara
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
