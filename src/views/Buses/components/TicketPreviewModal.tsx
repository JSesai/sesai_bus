import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Printer, Download, X, Loader2, CheckCircle2 } from "lucide-react";
import type { TicketPrintData } from "../../../electron/service/printer/printer.types";
import { toast } from "sonner";
import { QrTicket } from "./QrTicket";
import { generateTicketCode } from "../../../shared/utils/ticketCode";

interface TicketPreviewModalProps {
  open: boolean;
  onClose: () => void;
  ticketData: TicketPrintData;
}

function formatPurchaseDate(isoDate?: string): string {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function TicketPreviewModal({ open, onClose, ticketData }: TicketPreviewModalProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [printResult, setPrintResult] = useState<"success" | "pdf" | null>(null);

  const hasTicketIds = (ticketData.ticketIds?.length ?? 0) > 0;

  const ticketCode = useMemo(
    () =>
      hasTicketIds
        ? generateTicketCode({
            origin: ticketData.origin,
            destination: ticketData.destination,
            date: ticketData.date,
            time: ticketData.time,
            passengerName: ticketData.passengerName,
            seatNumbers: ticketData.seatNumbers,
            ticketIds: ticketData.ticketIds || [],
          })
        : "",
    [ticketData, hasTicketIds]
  );

  const handlePrint = async () => {
    if (!hasTicketIds) {
      toast.error("El boleto no tiene identificador; no se puede generar el QR.", { position: "top-center" });
      return;
    }

    setIsPrinting(true);
    try {
      const result = await window.electron.printer.print(ticketData);

      if (result.method === "printer") {
        setPrintResult("success");
        toast.success("Ticket impreso correctamente", { position: "top-center" });
      } else if (result.method === "pdf" && result.pdfData) {
        setPrintResult("pdf");
        downloadPdf(result.pdfData);
        toast.info("No se detectó impresora. Se descargó el ticket como PDF.", { position: "top-center" });
      }
    } catch {
      toast.error("Error al imprimir el ticket", { position: "top-center" });
    } finally {
      setIsPrinting(false);
    }
  };

  const downloadPdf = (pdfData: string) => {
    const link = document.createElement("a");
    link.href = pdfData;
    link.download = `ticket_${ticketData.passengerName.replace(/\s+/g, "_")}_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setPrintResult(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl">
        <DialogTitle className="sr-only">Vista Previa del Ticket</DialogTitle>

        {/* Ticket Preview */}
        <div className="p-5">
          <div className="bg-white text-black rounded-xl overflow-hidden shadow-inner">
            {/* Header */}
            <div className="bg-gray-900 text-white px-5 py-4 text-center">
              <p className="font-bold text-lg tracking-wide">{ticketData.agencyName}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {ticketData.agencyCity} — Tel: {ticketData.agencyPhone}
              </p>
              {ticketData.purchaseDate && (
                <p className="text-[10px] text-gray-500 mt-1 italic">
                  Compra: {formatPurchaseDate(ticketData.purchaseDate)}
                </p>
              )}
            </div>

            {/* Route */}
            <div className="px-5 pt-4 pb-3 border-b border-dashed border-gray-300">
              <div className="flex items-center justify-between gap-3">
                <div className="text-center flex-1">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Origen</p>
                  <p className="font-bold text-sm mt-0.5">{ticketData.origin}</p>
                </div>
                <div className="flex flex-col items-center px-2 shrink-0">
                  <div className="w-8 h-px bg-gray-300" />
                  <svg className="w-4 h-4 text-gray-400 my-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  <div className="w-8 h-px bg-gray-300" />
                </div>
                <div className="text-center flex-1">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Destino</p>
                  <p className="font-bold text-sm mt-0.5">{ticketData.destination}</p>
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="px-5 py-3 grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs border-b border-dashed border-gray-300">
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider">Fecha de salida</p>
                <p className="font-semibold mt-0.5">{ticketData.date}</p>
              </div>
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider">Hora de salida</p>
                <p className="font-semibold mt-0.5">{ticketData.time}</p>
              </div>
              {ticketData.isRoundTrip && ticketData.returnDate && (
                <div className="col-span-2">
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider">Regreso</p>
                  <p className="font-semibold mt-0.5">{ticketData.returnDate}</p>
                </div>
              )}
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider">Pasajero</p>
                <p className="font-semibold mt-0.5">{ticketData.passengerName}</p>
              </div>
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider">Asientos</p>
                <p className="font-semibold mt-0.5">{ticketData.seatNumbers.join(", ")}</p>
              </div>
            </div>

            {/* Total */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-dashed border-gray-300">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Total</span>
              <span className="text-lg font-bold">
                ${(Number(ticketData.totalAmount) || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* QR Code */}
            <div className="px-5 py-4 flex flex-col items-center gap-2">
              {ticketCode ? (
                <>
                  <QrTicket data={ticketCode} size={100} className="text-black" />
                  <p className="text-[10px] text-gray-500 text-center">
                    Presentar este código al abordar
                  </p>
                </>
              ) : (
                <p className="text-[11px] text-red-600 text-center font-medium">
                  Boleto sin identificador: no se puede generar el código QR. Reimprima el boleto desde la venta.
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-5 py-2.5 text-center">
              <p className="text-[10px] text-gray-400">Gracias por su compra — Buen viaje</p>
            </div>
          </div>
        </div>

        {/* Result Message */}
        {printResult && (
          <div className={`mx-5 mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${printResult === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
            {printResult === "success" ? (
              <>
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Ticket enviado a la impresora correctamente</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4 shrink-0" />
                <span>Se descargó el ticket como PDF</span>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-3">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            <X className="mr-2 h-4 w-4" />
            Cerrar
          </Button>
          <Button onClick={handlePrint} disabled={isPrinting || !hasTicketIds} className="flex-1">
            {isPrinting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Printer className="mr-2 h-4 w-4" />
            )}
            {printResult === "success" ? "Reimprimir" : "Imprimir"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
