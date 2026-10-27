import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { User, Phone, Calendar, CreditCard, Armchair, X, MapPin, Clock, TicketX, Printer, ArrowLeftRight, Sparkles } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { TicketPreviewModal } from './TicketPreviewModal';
import { useState } from 'react';
import { useDashboard } from '../../auth/context/DashBoardContext';
import { cn } from '../../lib/utils';
import type { Reservation } from '../../auth/context/ReservationContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';

interface ReservationDetailProps {
    reservation: Reservation
    onPayment: () => void
    onClose: () => void
    onReassign: () => void
    onCancel: (reservation: Reservation, reason: string) => Promise<void>
}

export function ReservationDetail({ reservation, onPayment, onClose, onReassign, onCancel }: ReservationDetailProps) {
    console.log('reservation detail ->', reservation);

    const { customer_name, customer_phone, reservation_date, departure_time, cityName: cityNameDestination, seats, total_amount, ticket_status, origin, return_date, base_fare } = reservation;
    const { agency } = useDashboard();
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);

    const safeTotal = Number(total_amount) || 0;
    const safeBaseFare = Number(base_fare) || 0;

    const handleReprint = () => {
        setShowTicketModal(true);
    };

    const handleCancelConfirm = async () => {
        if (!cancelReason.trim()) return;
        setIsCancelling(true);
        try {
            await onCancel(reservation, cancelReason);
            setShowCancelDialog(false);
            setCancelReason('');
        } finally {
            setIsCancelling(false);
        }
    };

    const handleOpenCancelDialog = () => {
        setShowCancelDialog(true);
    };

    return (
        <Card className="h-fit sticky top-4">
            <CardHeader >
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">Detalle de Reservación</CardTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 -mt-1 -mr-2"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Cerrar</span>
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">

                {/* Customer Information */}
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Información del Cliente
                    </h4>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-sm">
                            <User className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="font-medium text-foreground">{customer_name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-foreground">{customer_phone}</span>
                        </div>

                    </div>
                </div>

                <Separator />

                {/* travel Information */}
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Información del Viaje ({return_date ? 'Redondo' : 'Solo Ida'})
                    </h4>
                    <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="text-sm">
                            <p className="text-muted-foreground">Ruta</p>
                            <p className="font-medium text-foreground">{origin} → {cityNameDestination}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="text-sm">
                            <p className="text-muted-foreground">Fecha de salida</p>
                            <p className="font-medium text-foreground">{reservation_date}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="text-sm">
                            <p className="text-muted-foreground">Hora de salida</p>
                            <p className="font-medium text-foreground">{departure_time}</p>
                        </div>
                    </div>

                    {/* si es redondo, mostrar fecha de regreso */}
                    {return_date && <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="text-sm">
                            <p className="text-muted-foreground">Fecha de regreso</p>
                            <p className="font-medium text-foreground">{reservation_date}</p>
                        </div>
                    </div>
                    }

                </div>

                <Separator />

                {/* Seats */}
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Asientos Reservados ({seats.split(",").length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {seats.split(",").map((seat) => (
                            <span
                                key={seat}
                                className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1.5 text-sm font-medium text-secondary-foreground"
                            >
                                <Armchair className="h-3.5 w-3.5" />
                                {seat}
                            </span>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Total and Status */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Estado</span>
                        <StatusBadge status={ticket_status} />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-medium text-foreground">Total</span>
                        <div className="text-right">
                            {(() => {
                                const numSeats = seats.split(',').length;
                                const originalTotal = safeBaseFare * numSeats;
                                const hasDiscount = originalTotal > safeTotal;
                                return (
                                    <>
                                        {hasDiscount && (
                                            <div className="flex items-center justify-end gap-1.5 text-sm text-muted-foreground line-through">
                                                <Sparkles className="w-3 h-3" />
                                                ${originalTotal.toLocaleString('es-MX')}
                                            </div>
                                        )}
                                        <span className={cn("text-2xl font-bold", hasDiscount ? "text-destructive" : "text-primary")}>
                                            ${safeTotal.toLocaleString('es-MX')}
                                        </span>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                {/* Payment Button */}
                {ticket_status === 'reserved' && (
                    <Button onClick={onPayment} className="w-full" size="lg">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Realizar Pago
                    </Button>
                )}

                {ticket_status === 'occupied' && (
                    <>
                        <div className="rounded-lg bg-status-confirmed/20 border border-status-confirmed p-3 text-center">
                            <p className="text-sm font-medium text-status-confirmed-foreground">
                                Esta reservación ya fue confirmada
                            </p>
                        </div>
                        <Button onClick={handleReprint} className="w-full" size="lg" variant="outline">
                            <Printer className="mr-2 h-4 w-4" />
                            Reimprimir Ticket
                        </Button>
                    </>
                )}

                {(ticket_status === 'reserved' || ticket_status === 'occupied') && (
                    <Button onClick={onReassign} className="w-full" size="lg" variant="outline">
                        <ArrowLeftRight className="mr-2 h-4 w-4" />
                        Reasignar Asientos
                    </Button>
                )}

                {ticket_status === 'cancelled' ? (
                    <div className="rounded-lg bg-status-cancelled/20 border border-status-cancelled p-3 text-center">
                        <p className="text-sm font-medium text-status-cancelled-foreground">
                            Esta reservación fue cancelada
                        </p>
                    </div>
                ) :
                    <Button variant={'destructive'} onClick={handleOpenCancelDialog} className="w-full" size="lg" >
                        <TicketX className="mr-2 h-4 w-4" />
                        Cancelar reservación
                    </Button>
                }
            </CardContent>

            {/* Ticket Preview Modal */}
            <TicketPreviewModal
                open={showTicketModal}
                onClose={() => setShowTicketModal(false)}
                ticketData={{
                    agencyName: agency?.name || '',
                    agencyCity: agency?.city || '',
                    agencyPhone: agency?.phone || '',
                    origin,
                    destination: cityNameDestination,
                    date: reservation_date,
                    time: departure_time,
                    passengerName: customer_name,
                    seatNumbers: seats.split(',').map(s => parseInt(s.trim(), 10)),
                    ticketIds: reservation.ticketIds,
                    totalAmount: safeTotal,
                    isRoundTrip: !!return_date,
                    returnDate: return_date || undefined,
                }}
            />

            {/* Dialog de confirmación de cancelación */}
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancelar Reservación</DialogTitle>
                        <DialogDescription>
                            Se cancelarán {seats.split(',').length} asiento(s) reservados para <strong>{customer_name}</strong>. Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Motivo de cancelación *</label>
                        <Textarea
                            placeholder="Escribe el motivo de la cancelación..."
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setShowCancelDialog(false); setCancelReason(''); }} disabled={isCancelling}>
                            Volver
                        </Button>
                        <Button variant="destructive" onClick={handleCancelConfirm} disabled={!cancelReason.trim() || isCancelling}>
                            {isCancelling ? 'Cancelando...' : 'Confirmar Cancelación'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
