import { useState, useLayoutEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { BusLayout } from "../BusLayout/BusLayout";
import { Armchair } from "lucide-react";
import { useReservation, type Reservation } from "../../auth/context/ReservationContext";
import { useTicket } from "../../auth/context/TicketContext";

interface ReassignSeatDialogProps {
    open: boolean;
    onClose: () => void;
    reservation: Reservation;
}

export function ReassignSeatDialog({ open, onClose, reservation }: ReassignSeatDialogProps) {
    const { reassignReservationSeats, showNofification } = useReservation();
    const { seatColors } = useTicket();
    const [seats, setSeats] = useState<SeatData[]>([]);
    const [loading, setLoading] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const currentSeatNumbers = reservation.seats.split(",").map((s) => parseInt(s.trim(), 10));
    const selectedNewSeats = seats.filter((s) => s.status === "selected").map((s) => s.seat_number);

    useLayoutEffect(() => {
        if (open) {
            fetchSeats();
        }
    }, [open]);

    const fetchSeats = async () => {
        setLoading(true);
        const result = await window.electron.schedules.getVehicleSeatStatus(reservation.schedule_id);
        setLoading(false);

        if (!result.ok) {
            showNofification({
                typeAlert: "error",
                title: "Error al obtener asientos",
                message: result.error?.message || "No fue posible obtener el estado de los asientos",
            });
            return;
        }

        // Los asientos actuales del usuario se muestran como ocupados (no seleccionables)
        const updatedSeats: SeatData[] = result.data.map((seat: SeatData) => {
            if (currentSeatNumbers.includes(seat.seat_number)) {
                return { ...seat, status: "occupied" as const };
            }
            return seat;
        });

        setSeats(updatedSeats);
    };

    const handleSeatSelect = (seatId: number) => {
        const seat = seats.find((s) => s.seat_number === seatId);
        if (!seat || seat.status === "occupied" || seat.status === "selectedTemporal" || seat.status === "reserved") return;

        if (selectedNewSeats.length >= currentSeatNumbers.length && seat.status !== "selected") {
            showNofification({
                typeAlert: "info",
                title: "Límite de asientos",
                message: `Solo puedes seleccionar ${currentSeatNumbers.length} asiento(s) para reasignar.`,
                duration: 3000,
            });
            return;
        }

        setSeats((prev) =>
            prev.map((s) =>
                s.seat_number === seatId
                    ? { ...s, status: s.status === "selected" ? "available" : "selected" }
                    : s
            )
        );
    };

    const handleConfirm = async () => {
        if (selectedNewSeats.length !== currentSeatNumbers.length) {
            showNofification({
                typeAlert: "info",
                title: "Selecciona todos los asientos",
                message: `Debes seleccionar exactamente ${currentSeatNumbers.length} asiento(s).`,
            });
            return;
        }

        setConfirming(true);
        await reassignReservationSeats(
            reservation.schedule_id,
            reservation.customer_id,
            currentSeatNumbers,
            selectedNewSeats
        );
        setConfirming(false);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Reasignar Asientos</DialogTitle>
                    <DialogDescription>
                        Selecciona {currentSeatNumbers.length} nuevo(s) asiento(s) para {reservation.customer_name}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col md:flex-row gap-4 overflow-hidden flex-1 min-h-0">
                    {/* Bus layout */}
                    <div className="flex-1 overflow-y-auto min-h-0">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <p className="text-muted-foreground">Cargando asientos...</p>
                            </div>
                        ) : (
                            <BusLayout
                                seats={seats}
                                seatsPerRow={4}
                                onSeatSelect={handleSeatSelect}
                            />
                        )}
                    </div>

                    {/* Sidebar: info + legend + buttons */}
                    <div className="md:w-64 flex flex-col gap-4 shrink-0">
                        <div className="rounded-lg bg-muted p-3 text-sm space-y-1">
                            <p>
                                <span className="font-medium">Actuales:</span>{" "}
                                {currentSeatNumbers.join(", ")}
                            </p>
                            <p>
                                <span className="font-medium">Seleccionados:</span>{" "}
                                {selectedNewSeats.length} / {currentSeatNumbers.length}
                            </p>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-md ${seatColors.available} border-2 border-border`} />
                                <span>Disponible</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-md ${seatColors.selected} border-2 border-primary`} />
                                <span>Nuevo</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-md ${seatColors.occupied} border-2 border-border opacity-60`} />
                                <span>Ocupado / Actual</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-auto">
                            <Button variant="outline" onClick={onClose} disabled={confirming}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={selectedNewSeats.length !== currentSeatNumbers.length || confirming}
                            >
                                <Armchair className="mr-2 h-4 w-4" />
                                {confirming ? "Reasignando..." : "Confirmar"}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
