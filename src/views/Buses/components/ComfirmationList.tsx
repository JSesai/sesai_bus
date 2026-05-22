import { useState, useMemo, useEffect, useLayoutEffect } from 'react'
import { format, isSameDay, parseISO } from 'date-fns'
import { es, se } from 'date-fns/locale'
import { ReservationTable } from './ReservationTable'
import { ReservationDetail } from './ReservationDetail'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Calendar } from '../../components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger, } from '../../components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '../../components/ui/select'
// import { Dialog, DialogContent, DialogTitle } from '../../components/ui/dialog'
import { TicketCheck, Search, Filter, RefreshCw, CalendarIcon, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useReservation, type Reservation } from '../../auth/context/ReservationContext'
import { dateInFormatAMD } from '../../../shared/utils/helpers'
// import { OrderSummary } from './OrderSummary'
export type ReservationStatus = SeatData['status']



// Helper to get today's date in ISO format
// const today = new Date()
// const todayStr = today.toISOString().split('T')[0]
// export const mockReservations: Reservation[] = [
//     // Today's reservations
//     {
//         id: 'res-001',
//         customerId: 'cust-001',
//         customer: {
//             id: 1,
//             name: 'María García López',
//             phone: '+52 55 1234 5678',
//             email: 'maria.garcia@email.com',
//         },
//         scheduleId: 'sch-001',
//         eventName: 'Concierto de Rock Nacional',
//         eventDate: `${todayStr}T20:00:00`,
//         seatNumbers: ['A1', 'A2', 'A3'],
//         totalAmount: 1500,
//         status: 'reserved',
//         createdAt: `${todayStr}T09:30:00`,
//     },

// ]


type StatusFilter = 'all' | ReservationStatus

export default function ComfirmationList() {


    const { getReservationsByDate, reservations } = useReservation();

    // const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [showPayment, setShowPayment] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const dateAMD = useMemo(() => {
        return dateInFormatAMD(selectedDate ? selectedDate.toISOString() : '')
    }, [selectedDate])
    console.log({ selectedDate });

    console.log(dateInFormatAMD(selectedDate ? selectedDate.toISOString() : ''));


    // Filter reservations
    // const filteredReservations = useMemo(() => {
    //     return reservations.filter((res) => {
    //         const matchesSearch =
    //             res.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             res.customer_phone.includes(searchTerm)
    //         // res.eventName.toLowerCase().includes(searchTerm.toLowerCase())

    //         const matchesStatus = statusFilter === 'all' || res.ticket_status === statusFilter;
    //         // const matchesDate = res.da

    //         return matchesSearch && matchesStatus && matchesDate
    //     })
    // }, [reservations, searchTerm, statusFilter, selectedDate])

    // Count by status (for filtered results)
    // const statusCounts = useMemo(() => {
    //     const filtered = reservations.filter((res) => {
    //         const matchesDate = selectedDate
    //             ? isSameDay(parseISO(res.eventDate), selectedDate)
    //             : true
    //         return matchesDate
    //     })
    //     return filtered.reduce(
    //         (acc, res) => {
    //             acc[res.status] = (acc[res.status] || 0) + 1
    //             return acc
    //         },
    //         {} as Record<ReservationStatus, number>
    //     )
    // }, [reservations, selectedDate])

    // const totalForDate = useMemo(() => {
    //     if (!selectedDate) return reservations.length
    //     return reservations.filter((res) =>
    //         isSameDay(parseISO(res.eventDate), selectedDate)
    //     ).length
    // }, [reservations, selectedDate])

    const handleSelectReservation = (reservation: Reservation) => {
        setSelectedReservation(reservation)
        setShowPayment(false)
    }

    const handleCloseDetail = () => {
        setSelectedReservation(null)
        setShowPayment(false)
    }

    const handleOpenPayment = () => {
        setShowPayment(true)
    }

    const handleCancelPayment = () => {
        setShowPayment(false)
    }

    const handlePaymentComplete = () => {

    }

    const handleReset = () => {
        setReservations(mockReservations)
        setSelectedReservation(null)
        setShowPayment(false)
        setSearchTerm('')
        setStatusFilter('all')
        setSelectedDate(new Date())
    }

    const handleClearDate = () => {
        setSelectedDate(undefined)
    }




    useLayoutEffect(() => {
        getReservationsByDate(dateAMD)
    }, [selectedDate])

    return (
        <div className="bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary p-2">
                            <TicketCheck className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-foreground">
                                Confirmación de Reservaciones
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Sistema de Boletaje
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Stats Cards */}
                {/* <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-lg border bg-card p-4">
                        <p className="text-sm font-medium text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold text-foreground">
                            {totalForDate}
                        </p>
                    </div>
                    <div className="rounded-lg border bg-status-reserved/20 p-4">
                        <p className="text-sm font-medium text-status-reserved-foreground">
                            Pendientes
                        </p>
                        <p className="text-2xl font-bold text-status-reserved-foreground">
                            {statusCounts.reserved || 0}
                        </p>
                    </div>
                    <div className="rounded-lg border bg-status-confirmed/20 p-4">
                        <p className="text-sm font-medium text-status-confirmed-foreground">
                            Confirmadas
                        </p>
                        <p className="text-2xl font-bold text-status-confirmed-foreground">
                            {statusCounts.occupied || 0}
                        </p>
                    </div>
                    <div className="rounded-lg border bg-status-cancelled/20 p-4">
                        <p className="text-sm font-medium text-status-cancelled-foreground">
                            Canceladas
                        </p>
                        <p className="text-2xl font-bold text-status-cancelled-foreground">
                            {statusCounts.cancelled || 0}
                        </p>
                    </div>
                </div> */}

                {/* Filters */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                        {/* Date Picker */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'w-full justify-start text-left font-normal sm:w-[200px]',
                                        !selectedDate && 'text-muted-foreground'
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? (
                                        format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })
                                    ) : (
                                        <span>Todas las fechas</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    locale={es}
                                    initialFocus
                                />
                                {selectedDate && (
                                    <div className="border-t p-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full"
                                            onClick={handleClearDate}
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Ver todas las fechas
                                        </Button>
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>

                        {/* Search */}
                        <div className="relative flex-1 sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Buscar cliente, teléfono o evento..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Select
                                value={statusFilter}
                                onValueChange={(value) => setStatusFilter(value as StatusFilter)}
                            >
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Filtrar estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="pending">Pendientes</SelectItem>
                                    <SelectItem value="confirmed">Confirmadas</SelectItem>
                                    <SelectItem value="cancelled">Canceladas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reiniciar
                    </Button>
                </div>

                {/* Content Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Table Section */}
                    {/* <div className={selectedReservation ? 'lg:col-span-2' : 'lg:col-span-3'}>
                        <ReservationTable
                            reservations={filteredReservations}
                            selectedId={selectedReservation?.}
                            onSelect={handleSelectReservation}
                        />
                        {filteredReservations.length > 0 && (
                            <p className="mt-3 text-sm text-muted-foreground">
                                Mostrando {filteredReservations.length} de {totalForDate}{' '}
                                reservaciones
                                {selectedDate && (
                                    <span className="ml-1">
                                        para el {format(selectedDate, "d 'de' MMMM", { locale: es })}
                                    </span>
                                )}
                            </p>
                        )}
                    </div> */}

                    {/* Detail Panel */}
                    {selectedReservation && (
                        <div className="lg:col-span-1">
                            <ReservationDetail
                                reservation={selectedReservation}
                                onPayment={handleOpenPayment}
                                onClose={handleCloseDetail}
                            />
                        </div>
                    )}
                </div>
            </main>

            {/* Payment Dialog */}
            {/* <Dialog open={showPayment} onOpenChange={setShowPayment}>
                <DialogContent className="sm:max-w-md p-0 gap-0 border-0 bg-transparent shadow-none">
                    <DialogTitle className="sr-only">Realizar Pago</DialogTitle>
                    {selectedReservation && (
                        <h1>reservationsumary</h1>
                        // <OrderSummary
                           
                        // />
                    )}
                </DialogContent>
            </Dialog> */}
        </div>
    )
}
