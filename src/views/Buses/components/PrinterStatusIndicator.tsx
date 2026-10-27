import { useEffect, useState, useCallback } from "react";
import { Printer } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";

type PrinterStatus = "checking" | "connected" | "disconnected";

const STATUS_CONFIG: Record<PrinterStatus, { dot: string; badge: string; label: string }> = {
  checking: {
    dot: "bg-muted-foreground animate-pulse",
    badge: "border-border bg-muted/50 text-muted-foreground",
    label: "Verificando impresora...",
  },
  connected: {
    dot: "bg-green-400 animate-pulse",
    badge: "border-green-500/40 bg-green-500/10 text-green-500",
    label: "Impresora conectada",
  },
  disconnected: {
    dot: "bg-red-400",
    badge: "border-red-500/40 bg-red-500/10 text-red-500",
    label: "Impresora no detectada",
  },
};

export function PrinterStatusIndicator() {
  const [status, setStatus] = useState<PrinterStatus>("checking");

  const check = useCallback(async () => {
    try {
      const { connected } = await window.electron.printer.checkStatus();
      setStatus(connected ? "connected" : "disconnected");
    } catch {
      setStatus("disconnected");
    }
  }, []);

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        const { connected } = await window.electron.printer.checkStatus();
        if (active) setStatus(connected ? "connected" : "disconnected");
      } catch {
        if (active) setStatus("disconnected");
      }
    };
    run();
    const interval = setInterval(run, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const config = STATUS_CONFIG[status];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={check}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 h-auto border text-xs font-medium ${config.badge}`}
          >
            <span className={`h-2 w-2 rounded-full ${config.dot}`} />
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Impresora</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{config.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}