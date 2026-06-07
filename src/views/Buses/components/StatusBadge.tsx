import type { Reservation } from '../../auth/context/ReservationContext'
import { cn } from '../../lib/utils'

interface StatusBadgeProps {
    status: Reservation['ticket_status']
    className?: string
}

const statusConfig: Record<Reservation['ticket_status'], { label: string; className: string }> = {
    reserved: {
        label: 'Reservado',
        className: 'bg-amber-400',
    },
    occupied: {
        label: 'Confirmado',
        className: 'bg-green-400',
    },
    cancelled: {
        label: 'Cancelado',
        className: 'bg-red-200',
    },
    available: {
        label: 'available',
        className: 'bg-orange-300 text-orange-900',
    },
    selected: {
        label: 'selected',
        className: 'bg-orange-300 text-orange-900',
    },
    selectedTemporal: {
        label: 'selectedTemporal',
        className: 'bg-orange-300 text-orange-900',
    },



}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status]

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                config.className,
                className
            )}
        >
            {config.label}
        </span>
    )
}
