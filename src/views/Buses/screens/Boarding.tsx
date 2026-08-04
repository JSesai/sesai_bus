import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    QrCode, ScanLine, RefreshCw, CalendarDays, Bus, CheckCircle2,
    XCircle, User, RotateCcw, CameraOff, Search, UserCheck, UserX,
    Smartphone, ShieldCheck, KeyRound, Copy
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog";
import { useAuth } from "../../auth/context/AuthContext";
import showAlert from "../../Modals/Modals";
import { decodeTicketCode } from "../../../shared/utils/ticketCode";
import { QrTicket } from "../components/QrTicket";

function formatTime(time: string): string {
    if (!time) return "";
    const [h, m] = time.split(":");
    return `${h}:${m}`;
}

export default function Boarding() {
    const { userLogged } = useAuth();

    const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [departures, setDepartures] = useState<BoardingDeparture[]>([]);
    const [selectedSchedule, setSelectedSchedule] = useState<BoardingDeparture | null>(null);
    const [manifest, setManifest] = useState<BoardingManifestRow[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [showScanner, setShowScanner] = useState(false);
    const [scanningError, setScanningError] = useState<string | null>(null);
    const [manualCode, setManualCode] = useState("");
    const [isLookingUp, setIsLookingUp] = useState(false);
    const [pendingTickets, setPendingTickets] = useState<BoardingTicketInfo[] | null>(null);
    const [scheduleMismatch, setScheduleMismatch] = useState(false);

    const [boardingPin, setBoardingPin] = useState("");
    const [serverUrl, setServerUrl] = useState("");
    const [copied, setCopied] = useState(false);

    const loadMobileAccess = useCallback(async () => {
        const [pinResp, urlResp] = await Promise.all([
            window.electron.boarding.getPin(),
            window.electron.boarding.getServerUrl(),
        ]);
        if (pinResp.ok) setBoardingPin(pinResp.data?.pin || "");
        if (urlResp.ok) setServerUrl(urlResp.data?.url || "");
    }, []);

    useEffect(() => {
        loadMobileAccess();
    }, [loadMobileAccess]);

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const rafRef = useRef<number>(0);
    const scanningRef = useRef(false);

    const loadDepartures = useCallback(async (date: string) => {
        setIsLoading(true);
        try {
            const resp = await window.electron.boarding.getDeparturesByDate(date);
            if (resp.ok) setDepartures(resp.data || []);
            else toast.error(resp.error?.detail || "No fue posible obtener las salidas");
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadManifest = useCallback(async (scheduleId: number) => {
        try {
            const resp = await window.electron.boarding.getBoardingManifest(scheduleId);
            if (resp.ok) setManifest(resp.data || []);
            else toast.error(resp.error?.detail || "No fue posible obtener el manifiesto");
        } catch (e) {
            console.error(e);
        }
    }, []);

    useEffect(() => {
        setSelectedSchedule(null);
        setManifest([]);
        loadDepartures(selectedDate);
    }, [selectedDate, loadDepartures]);

    useEffect(() => {
        return () => stopScanner();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelectSchedule = (schedule: BoardingDeparture) => {
        setSelectedSchedule(schedule);
        setManifest([]);
        loadManifest(schedule.id);
    };

    const stopScanner = () => {
        cancelAnimationFrame(rafRef.current);
        scanningRef.current = false;
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        setShowScanner(false);
    };

    const startScanner = async () => {
        setScanningError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
            });
            streamRef.current = stream;
            const video = videoRef.current;
            if (!video) return;

            if (typeof BarcodeDetector === "undefined") {
                setScanningError("El escáner por cámara no está disponible en este equipo. Usa la captura manual.");
                setShowScanner(true);
                stream.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
                return;
            }

            video.srcObject = stream;
            await video.play();
            scanningRef.current = true;
            setShowScanner(true);

            const detector = new BarcodeDetector({ formats: ["qr_code"] });
            const detectLoop = async () => {
                if (!scanningRef.current) return;
                if (video.readyState < video.HAVE_ENOUGH_DATA) {
                    rafRef.current = requestAnimationFrame(detectLoop);
                    return;
                }
                try {
                    const codes = await detector.detect(video);
                    if (codes.length > 0 && codes[0].rawValue) {
                        stopScanner();
                        handleScanned(codes[0].rawValue);
                        return;
                    }
                } catch (e) {
                    // el detector no disponible o fallo puntual, seguimos intentando
                }
                rafRef.current = requestAnimationFrame(detectLoop);
            };
            rafRef.current = requestAnimationFrame(detectLoop);
        } catch (e) {
            console.error(e);
            setScanningError("No se pudo acceder a la cámara. Usa la captura manual.");
            setShowScanner(true);
        }
    };

    const handleScanned = async (raw: string) => {
        const decoded = decodeTicketCode(raw.trim());
        if (!decoded || decoded.ticketIds.length === 0) {
            toast.error("Código QR no reconocido", { position: "top-center" });
            return;
        }

        setIsLookingUp(true);
        try {
            const resp = await window.electron.boarding.getTicketsByIds(decoded.ticketIds);
            if (!resp.ok || !Array.isArray(resp.data) || resp.data.length === 0) {
                toast.error("Boleto no válido o cancelado", { position: "top-center" });
                return;
            }
            const tickets: BoardingTicketInfo[] = resp.data;

            const mismatch = selectedSchedule
                ? tickets.some((t) => t.schedule_id !== selectedSchedule.id)
                : false;
            setScheduleMismatch(mismatch);
            setPendingTickets(tickets);
        } catch (e) {
            console.error(e);
            toast.error("Error al identificar el boleto", { position: "top-center" });
        } finally {
            setIsLookingUp(false);
            setManualCode("");
        }
    };

    const confirmBoarding = async () => {
        if (!pendingTickets || pendingTickets.length === 0) return;
        const resp = await window.electron.boarding.markBoarded(
            pendingTickets.map((t) => t.ticket_id),
            userLogged?.id || 0
        );
        if (resp.ok) {
            toast.success(
                `Abordaje registrado para ${pendingTickets.length} asiento(s)`,
                { position: "top-center" }
            );
            setPendingTickets(null);
            if (selectedSchedule) loadManifest(selectedSchedule.id);
        } else {
            toast.error(resp.error?.detail || "Error al registrar el abordaje", { position: "top-center" });
        }
    };

    const handleUnmark = (tickets: BoardingManifestRow[]) => {
        const ids = tickets.map((t) => t.ticket_id);
        showAlert({
            typeAlert: "confirm",
            title: "Revertir abordaje",
            message: `¿Quieres marcar como pendiente el boleto de ${tickets[0]?.customer_name}?`,
            btnAccept: "Sí, revertir",
            btnCancel: "Cancelar",
            callbackAcept: async () => {
                const resp = await window.electron.boarding.unmarkBoarded(ids);
                if (resp.ok) {
                    toast.success("Abordaje revertido", { position: "top-center" });
                    if (selectedSchedule) loadManifest(selectedSchedule.id);
                } else {
                    toast.error(resp.error?.detail || "Error al revertir el abordaje", { position: "top-center" });
                }
            },
        });
    };

    const groups = useMemo(() => {
        const map = new Map<number, {
            customer_id: number;
            customer_name: string;
            customer_phone: string;
            seats: BoardingManifestRow[];
            allBoarded: boolean;
            anyBoarded: boolean;
        }>();
        manifest.forEach((row) => {
            const key = row.customer_id;
            if (!map.has(key)) {
                map.set(key, {
                    customer_id: row.customer_id,
                    customer_name: row.customer_name,
                    customer_phone: row.customer_phone,
                    seats: [],
                    allBoarded: false,
                    anyBoarded: false,
                });
            }
            map.get(key)!.seats.push(row);
        });
        map.forEach((group) => {
            group.anyBoarded = group.seats.some((s) => s.boarded_at);
            group.allBoarded = group.seats.every((s) => s.boarded_at);
        });
        return [...map.values()];
    }, [manifest]);

    const boardedCount = manifest.filter((r) => r.boarded_at).length;
    const pendingCount = manifest.length - boardedCount;

    const allPending = pendingTickets?.every((t) => !t.boarded_at) ?? false;
    const someAlreadyBoarded = pendingTickets?.some((t) => t.boarded_at) ?? false;

    return (
        <div className="space-y-4">
            <Card className="bg-card text-card-foreground border border-border transition-colors">
                <CardContent className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <ScanLine className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold">Abordaje</h1>
                                <p className="text-sm text-muted-foreground">
                                    Escanea el QR del boleto para registrar el abordaje
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative">
                                <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Button variant="outline" onClick={() => loadDepartures(selectedDate)} disabled={isLoading}>
                                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                                Actualizar
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Acceso móvil para el checador */}
            <Card className="bg-card text-card-foreground border border-border transition-colors">
                <CardContent className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <Smartphone className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="font-bold">Acceso desde el teléfono</h2>
                                <p className="text-sm text-muted-foreground">
                                    El checador abre esta dirección en su teléfono (misma red Wi-Fi) e ingresa el PIN.
                                    La primera vez debe aceptar el aviso de seguridad del certificado.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center gap-1">
                                <QrTicket data={serverUrl} size={88} />
                                <span className="text-[10px] text-muted-foreground">QR de acceso</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                    <span className="font-mono text-sm text-muted-foreground">{serverUrl || "https://..."}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            if (serverUrl) {
                                                navigator.clipboard?.writeText(serverUrl);
                                                setCopied(true);
                                                setTimeout(() => setCopied(false), 1500);
                                            }
                                        }}
                                    >
                                        <Copy className="h-4 w-4" />
                                        {copied ? "Copiado" : "Copiar"}
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                                        <KeyRound className="h-4 w-4 text-amber-500" />
                                        <span className="font-mono text-lg font-bold tracking-[0.3em]">{boardingPin || "----"}</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={async () => {
                                            const resp = await window.electron.boarding.regeneratePin();
                                            if (resp.ok) {
                                                setBoardingPin(resp.data?.pin || "");
                                                toast.success("PIN regenerado", { position: "top-center" });
                                            } else {
                                                toast.error("No fue posible regenerar el PIN", { position: "top-center" });
                                            }
                                        }}
                                    >
                                        <RotateCcw className="mr-1 h-3.5 w-3.5" />
                                        Nuevo PIN
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Selector de salida */}
            <Card className="bg-card text-card-foreground border border-border transition-colors">
                <CardContent className="p-5">
                    <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Salidas del {format(new Date(selectedDate + "T12:00:00"), "EEEE d 'de' MMMM yyyy", { locale: es })}
                    </h2>

                    {departures.length === 0 && !isLoading ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            No hay salidas programadas para esta fecha
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {departures.map((dep) => {
                                const isSelected = selectedSchedule?.id === dep.id;
                                return (
                                    <button
                                        key={dep.id}
                                        type="button"
                                        onClick={() => handleSelectSchedule(dep)}
                                        className={`rounded-xl border p-4 text-left transition-colors ${
                                            isSelected
                                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                : "border-border bg-card hover:bg-accent"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-mono text-xl font-bold">{formatTime(dep.departure_time)}</span>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                                                <Bus className="h-3 w-3" />
                                                Unidad {dep.vehicle_number}
                                            </span>
                                        </div>
                                        <p className="mt-1 font-semibold">
                                            {dep.city_origin} → {dep.city_destination}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{dep.terminal_destination}</p>
                                        <div className="mt-3 flex items-center gap-3 text-xs">
                                            <span className="flex items-center gap-1 text-muted-foreground">
                                                <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                                                {dep.boarded_seats} abordados
                                            </span>
                                            <span className="flex items-center gap-1 text-muted-foreground">
                                                <User className="h-3.5 w-3.5" />
                                                {dep.occupied_seats} vendidos
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Manifiesto */}
            {selectedSchedule && (
                <Card className="bg-card text-card-foreground border border-border transition-colors">
                    <CardContent className="p-5">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="font-bold">
                                    Manifiesto — {selectedSchedule.city_origin} → {selectedSchedule.city_destination}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {formatTime(selectedSchedule.departure_time)} hrs · Unidad {selectedSchedule.vehicle_number}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    {boardedCount} abordados
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                    <XCircle className="h-3.5 w-3.5" />
                                    {pendingCount} pendientes
                                </span>
                                <Button onClick={startScanner}>
                                    <QrCode className="mr-2 h-4 w-4" />
                                    Escanear
                                </Button>
                            </div>
                        </div>

                        {/* Captura manual */}
                        <div className="mb-4 flex items-center gap-2 rounded-lg border border-dashed border-border p-3">
                            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <Input
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && manualCode.trim()) handleScanned(manualCode);
                                }}
                                placeholder="Pega el código del boleto si no puedes escanear"
                                className="flex-1"
                            />
                            <Button
                                variant="outline"
                                onClick={() => manualCode.trim() && handleScanned(manualCode)}
                                disabled={!manualCode.trim() || isLookingUp}
                            >
                                {isLookingUp ? "Buscando..." : "Identificar"}
                            </Button>
                        </div>

                        {manifest.length === 0 ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No hay boletos vendidos o reservados para esta salida
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {groups.map((group) => (
                                    <div
                                        key={group.customer_id}
                                        className={`rounded-xl border p-4 ${
                                            group.allBoarded
                                                ? "border-emerald-500/30 bg-emerald-500/5"
                                                : "border-border bg-card"
                                        }`}
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                                                    {group.allBoarded ? (
                                                        <UserCheck className="h-4 w-4 text-emerald-500" />
                                                    ) : (
                                                        <UserX className="h-4 w-4 text-amber-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{group.customer_name}</p>
                                                    <p className="text-xs text-muted-foreground">{group.customer_phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {group.seats.map((s) => (
                                                        <span
                                                            key={s.ticket_id}
                                                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-xs font-semibold ${
                                                                s.boarded_at
                                                                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                                                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                                            }`}
                                                        >
                                                            {s.seat_number}
                                                            {s.boarded_at && <CheckCircle2 className="h-3 w-3" />}
                                                        </span>
                                                    ))}
                                                </div>
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                        group.allBoarded
                                                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                                    }`}
                                                >
                                                    {group.allBoarded
                                                        ? "Abordado"
                                                        : group.anyBoarded
                                                        ? "Parcial"
                                                        : "Pendiente"}
                                                </span>
                                                {group.anyBoarded && (
                                                    <Button variant="ghost" size="sm" onClick={() => handleUnmark(group.seats)}>
                                                        <RotateCcw className="mr-1 h-3.5 w-3.5" />
                                                        Revertir
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Modal escáner */}
            <Dialog open={showScanner} onOpenChange={(open) => !open && stopScanner()}>
                <DialogContent className="sm:max-w-md">
                    <DialogTitle>Escanear boleto</DialogTitle>
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black">
                        <video
                            ref={videoRef}
                            className="h-full w-full object-cover"
                            playsInline
                            muted
                        />
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <div className="h-40 w-40 rounded-xl border-2 border-white/70" />
                        </div>
                        {scanningError && (
                            <div className="absolute inset-x-0 bottom-0 bg-black/70 p-3 text-center text-xs text-white">
                                {scanningError}
                            </div>
                        )}
                    </div>
                    {isLookingUp && (
                        <p className="text-center text-sm text-muted-foreground">
                            Identificando boleto...
                        </p>
                    )}
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={stopScanner}>
                            <CameraOff className="mr-2 h-4 w-4" />
                            Cerrar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Confirmación de abordaje */}
            <Dialog open={!!pendingTickets} onOpenChange={(open) => !open && setPendingTickets(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogTitle>Confirmar abordaje</DialogTitle>

                    {scheduleMismatch && (
                        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-600 dark:text-amber-400">
                            Este boleto pertenece a otra salida. Verifica antes de registrar.
                        </div>
                    )}

                    {pendingTickets && (
                        <div className="space-y-3">
                            {pendingTickets.map((t) => (
                                <div
                                    key={t.ticket_id}
                                    className="flex items-center justify-between rounded-lg border border-border p-3"
                                >
                                    <div>
                                        <p className="font-semibold">{t.customer_name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {t.city_origin} → {t.city_destination}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-mono text-sm font-bold">Asiento {t.seat_number}</span>
                                        <p className="text-xs text-muted-foreground">
                                            Salida {t.dateDeparture} · {formatTime(t.departure_time)} hrs
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {someAlreadyBoarded && (
                                <p className="rounded-lg bg-amber-500/10 p-2 text-xs text-amber-600 dark:text-amber-400">
                                    Uno o más asientos ya estaban abordados.
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setPendingTickets(null)}>
                            Cancelar
                        </Button>
                        <Button onClick={confirmBoarding}>
                            {allPending ? "Registrar abordaje" : "Confirmar abordaje"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
