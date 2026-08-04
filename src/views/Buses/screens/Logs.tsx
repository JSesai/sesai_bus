import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshCw, ScrollText, Trash2, Pause, Play } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";

const LEVELS: { value: LogLevel | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "error", label: "Errores" },
  { value: "warn", label: "Advertencias" },
  { value: "info", label: "Info" },
  { value: "debug", label: "Debug" },
];

const LEVEL_COLOR: Record<string, string> = {
  debug: "text-slate-400",
  info: "text-sky-400",
  warn: "text-amber-400",
  error: "text-red-400",
};

const SCOPE_COLOR: Record<string, string> = {
  renderer: "bg-purple-500/10 text-purple-400",
  ipc: "bg-cyan-500/10 text-cyan-400",
  boarding: "bg-emerald-500/10 text-emerald-400",
  "waiting-room": "bg-blue-500/10 text-blue-400",
  main: "bg-slate-500/10 text-slate-300",
};

export default function Logs() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [level, setLevel] = useState<LogLevel | "all">("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await window.electron.logs.get({
        limit: 300,
        level: level === "all" ? undefined : level,
      });
      if (res.ok && res.data) {
        setEntries(res.data.entries);
      }
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [level]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(load, 3000);
    return () => clearInterval(timer);
  }, [autoRefresh, load]);

  useEffect(() => {
    const el = listRef.current;
    if (el && autoRefresh) el.scrollTop = 0;
  }, [entries, autoRefresh]);

  const handleClear = async () => {
    await window.electron.logs.clear();
    setEntries([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold">Registros del Sistema</h2>
          <p className="text-muted-foreground mt-1">
            Logs de la aplicación, los servidores y los procesos. Archivo: <code className="text-xs">userData/logs/app.log</code>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={autoRefresh ? "default" : "outline"} size="sm" onClick={() => setAutoRefresh(v => !v)}>
            {autoRefresh ? <><Pause className="mr-2 h-4 w-4" /> Detener</> : <><Play className="mr-2 h-4 w-4" /> En vivo</>}
          </Button>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Actualizar
          </Button>
          <Button variant="destructive" size="sm" onClick={handleClear}>
            <Trash2 className="mr-2 h-4 w-4" /> Limpiar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5" />
            Bitácora
          </CardTitle>
          <CardDescription>
            Últimas {entries.length} entradas, más recientes primero.
          </CardDescription>
          <div className="flex flex-wrap gap-2 mt-2">
            {LEVELS.map((lvl) => (
              <Button
                key={lvl.value}
                variant={level === lvl.value ? "default" : "outline"}
                size="sm"
                onClick={() => setLevel(lvl.value)}
              >
                {lvl.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div
            ref={listRef}
            className="h-[60vh] overflow-y-auto rounded-lg border border-border bg-black/40 font-mono text-xs leading-relaxed p-4 space-y-1"
          >
            {entries.length === 0 && (
              <div className="text-muted-foreground italic">Sin registros.</div>
            )}
            {entries.map((entry) => (
              <div key={entry.id} className="flex gap-2 flex-wrap">
                <span className="text-muted-foreground whitespace-nowrap">{entry.ts}</span>
                <span className={`font-bold whitespace-nowrap ${LEVEL_COLOR[entry.level] || ""}`}>
                  [{entry.level.toUpperCase()}]
                </span>
                <span className={`px-1.5 rounded whitespace-nowrap ${SCOPE_COLOR[entry.scope] || "bg-muted/50 text-muted-foreground"}`}>
                  {entry.scope}
                </span>
                <span className="break-all text-foreground/90">{entry.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
