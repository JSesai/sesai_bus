import { useState, useMemo, useLayoutEffect, useEffect } from 'react';
import { format, set } from 'date-fns';
import { es } from 'date-fns/locale';
import { ReservationDetail } from './ReservationDetail';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '../../components/ui/select';
import { TicketCheck, Search, Filter, RefreshCw, CreditCard, HandCoins, Banknote, LucideBanknoteArrowDown, Landmark } from 'lucide-react'
import { useReservation, type Reservation } from '../../auth/context/ReservationContext';
import { useDashboard } from '../../auth/context/DashBoardContext';
import { dateInFormatAMD } from '../../../shared/utils/helpers';
import { ReservationTable } from './ReservationTable';
import { CalendarCustom } from './CalendarCustom';
import { Dialog, DialogContent, DialogTitle } from '../../components/ui/dialog';
import PayForm from './PayForm';
import { ReassignSeatDialog } from './ReassignSeatDialog';

export type ReservationStatus = SeatData['status']



type StatusFilter = 'all' | 'roundTrip' | 'sencillo' | ReservationStatus

export default function ComfirmationList() {


    const { getReservationsByDate, reservations, showNofification, payReservation, cancelReservation } = useReservation();
    const { agency, serviceFeePercent } = useDashboard();

    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [showPayment, setShowPayment] = useState(false)
    const [showReassignDialog, setShowReassignDialog] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [paymentMethod, setPaymentMethod] = useState<Payment['method']>("cash")

    const [cashReceived, setCashReceived] = useState("");




    const dateAMD = useMemo(() => {
        return dateInFormatAMD(selectedDate ? selectedDate.toISOString() : '')
    }, [selectedDate])

    // Filter reservations
    const filteredReservations = useMemo(() => {
        return reservations.filter((res) => {
            const matchesSearch =
                res.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                res.customer_phone.includes(searchTerm)

            const matchesStatus = statusFilter === 'all' || res.ticket_status === statusFilter || (statusFilter === 'roundTrip' && res.return_date !== null) || (statusFilter === 'sencillo' && res.return_date === null);
            const matchesDate = res.reservation_date

            return matchesSearch && matchesStatus && matchesDate
        })
    }, [reservations, searchTerm, statusFilter, selectedDate])

    // Count by status (for filtered results)
    const statusCounts = useMemo(() => {
        const filtered = reservations.filter((res) => {
            const matchesDate = selectedDate ? res.reservation_date === dateAMD : true
            return matchesDate
        })

        return filtered.reduce(
            (acc, res) => {
                acc[res.ticket_status as ReservationStatus] = (acc[res.ticket_status as ReservationStatus] || 0) + 1
                return acc
            },
            {} as Record<ReservationStatus, number>
        )
    }, [reservations, selectedDate])

    const totalForDate = useMemo(() => {
        if (!selectedDate) return reservations.length
        return reservations.filter((res) => res.reservation_date === dateAMD).length

    }, [reservations, selectedDate])

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

    const handleOpenReassign = () => {
        setShowReassignDialog(true)
    }

    const handleCloseReassign = () => {
        setShowReassignDialog(false)
    }

    const handleCancelReservation = async (reservation: Reservation, reason: string) => {
        await cancelReservation(reservation, reason)
        setSelectedReservation(null)
    }

    const handlePaymentComplete = () => {

    }

    const handleReset = () => {
        // setReservations(mockReservations)
        setSelectedReservation(null)
        setShowPayment(false)
        setSearchTerm('')
        setStatusFilter('all')
        setSelectedDate(new Date())
    }

    const handleClearDate = () => {
        setSelectedDate(undefined)
    }

    const handleCashReceivedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d.]/g, "")
        // Only allow one decimal point
        const parts = value.split(".")
        if (parts.length > 2) return
        if (parts[1]?.length > 2) return
        setCashReceived(value)
    }

    const total = selectedReservation?.total_amount || 0
    const serviceFee = total * (serviceFeePercent / 100)
    const finalTotal = total + serviceFee

    const cashReceivedNumber = parseFloat(cashReceived) || 0
    const change = useMemo(() => {
        return cashReceivedNumber - finalTotal
    }, [cashReceivedNumber, finalTotal])

    const canCompleteCashPayment = cashReceivedNumber >= finalTotal

    const quickCashAmounts = useMemo(() => {
        const rounded = Math.ceil(finalTotal / 100) * 100
        const amounts = new Set([rounded, rounded + 100, rounded + 200, Math.ceil(finalTotal)])
        return [...amounts]
    }, [finalTotal])


    const handlePayReservation = async () => {

        if (paymentMethod === 'cash' && !canCompleteCashPayment) return;

        try {
            //logica de pago
            if (selectedReservation) {
                await payReservation(selectedReservation, paymentMethod);

                const ticketPrintData: TicketPrintData = {
                    agencyName: agency?.name || '',
                    agencyCity: agency?.city || '',
                    agencyPhone: agency?.phone || '',
                    origin: selectedReservation.origin,
                    destination: selectedReservation.cityName,
                    date: selectedReservation.reservation_date,
                    time: selectedReservation.departure_time,
                    passengerName: selectedReservation.customer_name,
                    seatNumbers: selectedReservation.seats.split(',').map(s => parseInt(s.trim(), 10)),
                    totalAmount: Number(selectedReservation.total_amount) || 0,
                    isRoundTrip: !!selectedReservation.return_date,
                    returnDate: selectedReservation.return_date || undefined,
                    purchaseDate: new Date().toISOString(),
                };

                window.electron.printer.print(ticketPrintData).then((result) => {
                    if (result.method === "pdf" && result.pdfData) {
                        const link = document.createElement("a");
                        link.href = result.pdfData;
                        link.download = `ticket_${ticketPrintData.passengerName.replace(/\s+/g, "_")}_${Date.now()}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                }).catch(() => {});

                //cerrar modal de pago
                setShowPayment(false);
                setSelectedReservation(null);
            }

            //impresion de ticket


            //cerrar modal

        } catch (error) {
            console.error('Error al procesar el pago de la reservación:', error);
            showNofification({
                typeAlert: 'error',
                title: 'Error al procesar el pago',
                message: 'Ocurrió un error al procesar el pago de la reservación. Por favor, inténtelo de nuevo.'
            })
        }




    }

    useLayoutEffect(() => {
        getReservationsByDate(dateAMD)
    }, [selectedDate]);

    {/* mostrar mensaje de metodo no implentado si el metodo de pago es tarjeta */ }
    useEffect(() => {

        if (paymentMethod === "card") {
            showNofification({
                typeAlert: 'info',
                title: 'Función no implementada',
                message: 'La función de cobro con tarjeta no está implementada en esta versión.'
            })
        }
    }, [paymentMethod])

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
                                Administra  y controla las Reservaciones
                            </h1>

                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Stats Cards */}
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
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
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                        {/* Date Picker */}
                        <div className='mb-3'>

                            <CalendarCustom
                                value={selectedDate}
                                mode='single'
                                onChange={(val) => {
                                    if (val instanceof Date || val === undefined) {
                                        setSelectedDate(val);
                                    }
                                }}
                            />
                        </div>
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
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Filtrar estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="reserved">Pendientes</SelectItem>
                                    <SelectItem value="occupied">Confirmadas</SelectItem>
                                    <SelectItem value="roundTrip">Redondos</SelectItem>
                                    <SelectItem value="sencillo">Sencillos</SelectItem>
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
                    <div className={selectedReservation ? 'lg:col-span-2' : 'lg:col-span-3'}>
                        <ReservationTable
                            reservations={filteredReservations}
                            selectedId={String(selectedReservation?.id)}
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
                    </div>

                    {/* Detail Panel */}
                    {selectedReservation && (
                        <div className="lg:col-span-1">
                            <ReservationDetail
                                reservation={selectedReservation}
                                onPayment={handleOpenPayment}
                                onClose={handleCloseDetail}
                                onReassign={handleOpenReassign}
                                onCancel={handleCancelReservation}
                            />
                        </div>
                    )}
                </div>
            </main>

            {/* Modal del pago de la reservacion */}
            <Dialog open={showPayment} onOpenChange={setShowPayment}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0 border-0 bg-transparent shadow-2xl">
                    <DialogTitle className="sr-only">Realizar Pago</DialogTitle>
                    {selectedReservation && (
                        <div>
                            <PayForm
                                handleSubmit={handlePayReservation}
                                canCompleteCashPayment={canCompleteCashPayment}
                                cashReceived={cashReceived}
                                handleCashReceivedChange={handleCashReceivedChange}
                                cashReceivedNumber={cashReceivedNumber}
                                change={change}
                                finalTotal={finalTotal}
                                paymentMethod={paymentMethod}
                                setPaymentMethod={setPaymentMethod}
                                quickCashAmounts={quickCashAmounts}
                                setCashReceived={setCashReceived}

                            />

                            <div className="px-6 pb-6">
                                <Button
                                    onClick={handlePayReservation}
                                    className="w-full"
                                    size="lg"
                                    disabled={paymentMethod === 'cash' ? !canCompleteCashPayment : false}
                                >
                                    {paymentMethod === "cash" && <LucideBanknoteArrowDown className="w-4 h-4 mr-2" />}
                                    {paymentMethod === "transfer" && <Landmark className="w-4 h-4 mr-2" />}
                                    {paymentMethod === "card" && <CreditCard className="w-4 h-4 mr-2" />}

                                    Confirmar pago
                                </Button>
                            </div>
                        </div>


                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog de reasignación de asientos */}
            {selectedReservation && (
                <ReassignSeatDialog
                    open={showReassignDialog}
                    onClose={handleCloseReassign}
                    reservation={selectedReservation}
                />
            )}
        </div>
    )
}
