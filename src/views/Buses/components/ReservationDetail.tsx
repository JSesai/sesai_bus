import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';

import { User, Phone, Mail, Calendar, CreditCard, Armchair, X } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { StatusBadge } from './StatusBadge';
import type { Reservation } from '../../auth/context/ReservationContext';

interface ReservationDetailProps {
    reservation: Reservation
    onPayment: () => void
    onClose: () => void
}

export function ReservationDetail({ reservation, onPayment, onClose, }: ReservationDetailProps) {
    console.log('reservation detail ->', reservation);

    const { customer_name, customer_phone, reservation_date, departure_time, cityName, seats, total_amount, ticket_status } = reservation;

    const formattedDate = format(new Date(reservation_date), "EEEE, d 'de' MMMM 'de' yyyy", {
        locale: es,
    })
    const formattedTime = format(new Date(departure_time), 'HH:mm')

    return (
        <Card className="h-fit sticky top-4">
            <CardHeader className="pb-4">
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
            <CardContent className="space-y-6">
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
                        {/* {customer.email && (
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="text-foreground truncate">{customer.email}</span>
                            </div>
                        )} */}
                    </div>
                </div>

                <Separator />

                {/* Event Information */}
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Evento
                    </h4>
                    <div className="space-y-2">
                        <p className="font-medium text-foreground text-balance">{cityName}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 shrink-0" />
                            <span className="capitalize">{formattedDate}</span>
                        </div>
                        <p className="text-sm text-muted-foreground ml-7">{formattedTime} hrs</p>
                    </div>
                </div>

                <Separator />

                {/* Seats */}
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Asientos Reservados ({seats.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {[seats].map((seat) => (
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
                        <StatusBadge status={status} />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-medium text-foreground">Total</span>
                        <span className="text-2xl font-bold text-primary">
                            ${total_amount.toLocaleString('es-MX')}
                        </span>
                    </div>
                </div>

                {/* Payment Button */}
                {ticket_status === 'pending' && (
                    <Button onClick={onPayment} className="w-full" size="lg">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Realizar Pago
                    </Button>
                )}

                {ticket_status === 'confirmed' && (
                    <div className="rounded-lg bg-status-confirmed/20 border border-status-confirmed p-3 text-center">
                        <p className="text-sm font-medium text-status-confirmed-foreground">
                            Esta reservación ya fue confirmada
                        </p>
                    </div>
                )}

                {ticket_status === 'cancelled' && (
                    <div className="rounded-lg bg-status-cancelled/20 border border-status-cancelled p-3 text-center">
                        <p className="text-sm font-medium text-status-cancelled-foreground">
                            Esta reservación fue cancelada
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
