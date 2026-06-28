import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../../components/ui/table";
import { StatusBadge } from './StatusBadge';
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '../../lib/utils'
import type { Reservation } from "../../auth/context/ReservationContext";


interface ReservationTableProps {
    reservations: Reservation[]
    selectedId?: string
    onSelect: (reservation: Reservation) => void
}

export function ReservationTable({
    reservations,
    selectedId,
    onSelect,
}: ReservationTableProps) {
    return (
        <div className="rounded-lg border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[180px]">Cliente</TableHead>
                        <TableHead className="w-[130px]">Teléfono</TableHead>
                        <TableHead className="w-[130px]">Fecha Salida</TableHead>
                        <TableHead className="w-[120px]">Tipo</TableHead>
                        <TableHead className="w-[120px]">Asientos</TableHead>
                        <TableHead className="w-[100px] text-right">Monto Total</TableHead>
                        <TableHead className="w-[100px] text-center">Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reservations.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="h-24 text-center text-muted-foreground"
                            >
                                No hay reservaciones pendientes
                            </TableCell>
                        </TableRow>
                    ) : (
                        reservations.map((reservation) => {
                            const isSelected = selectedId === reservation.id
                            return (
                                <TableRow
                                    key={reservation.id}
                                    onClick={() => onSelect(reservation)}
                                    className={cn(
                                        'cursor-pointer transition-colors',
                                        isSelected && 'bg-primary/5 hover:bg-primary/10'
                                    )}
                                    data-state={isSelected ? 'selected' : undefined}
                                >
                                    <TableCell className="font-medium text-foreground">
                                        <div className="truncate max-w-[180px]">
                                            {reservation.customer_name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {reservation.customer_phone}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        <div className="space-y-0.5">
                                            <div>
                                                {reservation.reservation_date}
                                            </div>
                                            <div className="text-xs">
                                                {reservation.departure_time} hrs
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        <div className="space-y-0.5">
                                            <div>
                                                {reservation.return_date ? 'Redondo' : 'Solo Ida'}
                                            </div>
                                            <div className="text-xs">
                                                {reservation.return_date}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {reservation.seats.split(',').slice(0, 3).map((seat) => (
                                                <span
                                                    key={seat}
                                                    className="inline-flex items-center rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground"
                                                >
                                                    {seat}
                                                </span>
                                            ))}
                                            {reservation.seats.split(',').length > 3 && (
                                                <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                                                    +4
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-foreground">
                                        ${reservation.total_amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <StatusBadge status={reservation.ticket_status} />
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
