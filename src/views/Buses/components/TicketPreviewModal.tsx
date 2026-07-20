import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Printer, Download, X, Loader2, CheckCircle2 } from "lucide-react";
import type { TicketPrintData } from "../../../electron/service/printer/printer.types";
import { toast } from "sonner";

interface TicketPreviewModalProps {
  open: boolean;
  onClose: () => void;
  ticketData: TicketPrintData;
}

export function TicketPreviewModal({ open, onClose, ticketData }: TicketPreviewModalProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [printResult, setPrintResult] = useState<"success" | "pdf" | null>(null);

  const handlePrint = async () => {
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
    } catch (error) {
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
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <DialogTitle className="sr-only">Vista Previa del Ticket</DialogTitle>

        {/* Ticket Preview */}
        <div className="p-6 border-b border-border">
          <div className="bg-white text-black rounded-lg p-4 font-mono text-sm shadow-inner">
            <div className="text-center border-b border-dashed border-gray-400 pb-3 mb-3">
              <p className="font-bold text-base">{ticketData.agencyName}</p>
              <p className="text-xs text-gray-600">{ticketData.agencyCity} - Tel: {ticketData.agencyPhone}</p>
            </div>

            <div className="space-y-1 text-xs">
              <p><span className="font-bold">ORIGEN:</span> {ticketData.origin}</p>
              <p><span className="font-bold">DESTINO:</span> {ticketData.destination}</p>
              <hr className="border-dashed border-gray-300 my-2" />
              <p><span className="font-bold">FECHA:</span> {ticketData.date}</p>
              <p><span className="font-bold">HORA:</span> {ticketData.time}</p>
              {ticketData.isRoundTrip && ticketData.returnDate && (
                <p><span className="font-bold">REGRESO:</span> {ticketData.returnDate}</p>
              )}
              <hr className="border-dashed border-gray-300 my-2" />
              <p><span className="font-bold">PASAJERO:</span> {ticketData.passengerName}</p>
              <p><span className="font-bold">TELEFONO:</span> {ticketData.passengerPhone}</p>
              <hr className="border-dashed border-gray-300 my-2" />
              <p><span className="font-bold">ASIENTOS:</span> {ticketData.seatNumbers.join(", ")}</p>
              <p><span className="font-bold">CANTIDAD:</span> {ticketData.seatNumbers.length}</p>
            </div>

            <div className="text-center border-t border-dashed border-gray-400 mt-3 pt-3">
              <p className="font-bold text-base">
                TOTAL: ${ticketData.totalAmount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="text-center text-xs text-gray-500 mt-3">
              <p>Gracias por su compra</p>
              <p>Buen viaje!</p>
            </div>
          </div>
        </div>

        {/* Result Message */}
        {printResult && (
          <div className={`mx-6 mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${printResult === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
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
        <div className="p-6 flex gap-3">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            <X className="mr-2 h-4 w-4" />
            Cerrar
          </Button>
          <Button onClick={handlePrint} disabled={isPrinting} className="flex-1">
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
