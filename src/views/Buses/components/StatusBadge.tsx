'use client'

import { cn } from '../../lib/utils'
import type { ReservationStatus } from './ComfirmationList'

interface StatusBadgeProps {
    status: ReservationStatus
    className?: string
}

const statusConfig: Record<ReservationStatus, { label: string; className: string }> = {
    reserved: {
        label: 'Reservado',
        className: 'bg-status-reserved text-status-reserved-foreground',
    },
    occupied: {
        label: 'Confirmado',
        className: 'bg-status-confirmed text-status-confirmed-foreground',
    },
    cancelled: {
        label: 'Cancelado',
        className: 'bg-status-cancelled text-status-cancelled-foreground',
    },
    available: {
        label: 'available',
        className: 'bg-status-cancelled text-status-cancelled-foreground',
    },
    selected: {
        label: 'selected',
        className: 'bg-status-cancelled text-status-cancelled-foreground',
    },
    selectedTemporal: {
        label: 'selectedTemporal',
        className: 'bg-status-cancelled text-status-cancelled-foreground',
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
