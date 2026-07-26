import { createContext, useContext, useState } from "react";
import { useDashboard } from "./DashBoardContext";
import showAlert, { type PropsModal } from "../../Modals/Modals";
import { toast } from "sonner";


export enum stepsReservationComfirm {
    comfirmationsList = 0,
    paymentReservation = 1,
}



type ReservationContextType = {
    //data
    isLoading: boolean;
    reservations: Reservation[];


    // scheduleToSelection: Schedule[];
    // numberDeparturesToday: number;
    // state: TripState;
    // stepsComfirmationReservation: Step[],
    currentStep: stepsReservationComfirm;
    // stepCompletedTravelTypeAndBookingType: boolean;
    // stepCompletedOrigenDestination: boolean;
    // stepCompletedSelectedDates: boolean;
    // isRoundTrip: boolean;
    backgrounTiketSale: string;
    // isReservation: boolean;
    // hasInapamPassengers: boolean;
    // totalPassengers: number;
    // stepCompletedPassengersSelection: boolean;
    // stepCompletedSelectedSeats: boolean;

    // destinationSelected: Route | null;
    // cityOrigin: string;
    // cityDestination: string;
    // vehicleForTripe: Bus | null;
    // seats: SeatData[];
    // seatsSelected: number[];
    // selectedSchedule: Schedule | null;
    seatColors: {
        available: string;
        selected: string;
        occupied: string;
        reserved: string;
        selectedTemporal: string;
    };

    //methods

    // dispatch: React.Dispatch<ActionTripReducer>;
    showModalAlert: (props: PropsModal) => void
    showNofification: (props: PropsModal) => void;
    getReservationsByDate: (dateReservation: string) => Promise<void>;
    // handleSeatSelect: (seatId: number) => void;
    handleRegisterCustomer: (customer: Customer, isSearch: boolean) => Promise<Customer | null>;
    // handleConfirmTicketSale: () => Promise<void>;
    payReservation: (r: Reservation) => Promise<void>;
    handleConfirmReservation: () => Promise<void>;
    reassignReservationSeats: (scheduleId: number, customerId: number, oldSeats: number[], newSeats: number[]) => Promise<void>;
    cancelReservation: (reservation: Reservation, reason: string) => Promise<void>;

};

export interface Reservation {
    id?: number;
    cityName: string;
    customer_id: number;
    customer_name: string;
    customer_phone: string;
    departure_time: string;
    vehicle_number: string;
    origin: string;
    reservation_date: string;
    return_date: string | null;
    schedule_id: number;
    seats: string;
    terminalName: string;
    ticket_status: SeatData['status'];
    total_amount: number;
    base_fare: number;
}

export const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export function ReservationProvider({ children }: { children: React.ReactNode }) {


    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading] = useState(false);
    const [currentStep] = useState<stepsReservationComfirm>(stepsReservationComfirm.comfirmationsList);



    const seatColors = {
        available: "bg-seat-available",
        selected: "bg-seat-selected",
        occupied: "bg-seat-occupied",
        reserved: "bg-seat-reserved",
        selectedTemporal: "bg-seat-temporal",
    }


    const showNofification = ({ typeAlert, message, title, duration, btnAccept, callbackAcept }: PropsModal) => {

        switch (typeAlert) {
            case 'success':
                return toast.success(title, {
                    description: message,
                    richColors: true,
                    duration: duration ? duration : 8_000,
                    position: 'top-center'
                })

            case 'error':
                return toast.error(title, {
                    richColors: true,
                    description: message,
                    duration: duration ? duration : 10_000,
                    position: 'top-center'
                })


            case 'info':
                return toast.info(title, {
                    description: message,
                    richColors: true,
                    duration: duration ? duration : 8_000,
                    position: 'top-center',
                    ...btnAccept && {
                        action: {
                            label: 'Aceptar',
                            onClick: () => {
                                if (callbackAcept) callbackAcept();
                            }
                        }
                    }

                })


            default:
                return toast(message, {
                    description: message,
                    richColors: true,
                    duration: duration ? duration : 10_000,
                    position: 'top-center'
                })

        }


    }

    //memorizar fn debe cambiar cuando cambie la fecha de reservaciones 
    const getReservationsByDate = async (dateReservation: string) => {
        const reservationsDate = await window.electron.tickets.getReservationsByDate(dateReservation);
        console.log({ reservationsDate });

        if (!reservationsDate.ok) {
            showNofification({
                typeAlert: 'error',
                title: 'Error al obtener reservaciones',
                message: reservationsDate.error?.message || 'No fue posible obtener información de la reservaciones, intenta nuevamente'
            })
            return
        }


        setReservations(reservationsDate.data);



    }



    //obtiene nombre de customer 
    const handleRegisterCustomer = async (customer: Customer, isSearch: boolean): Promise<Customer | null> => {

        if (isSearch) {
            const customerNameToRegister = await window.electron.customers.getCustomerByPhone(customer.phone);
            console.warn('customerNameToRegister ->', customerNameToRegister);
            if (!customerNameToRegister.ok) return null;

            return customerNameToRegister.data;
        } else {

            const currentCustomer = await window.electron.customers.createOrUpdateCustomer(customer);
            if (currentCustomer.ok) return currentCustomer.data;

            showNofification({
                typeAlert: 'error',
                title: currentCustomer.error?.message,
                message: currentCustomer.error?.detail
            })
            return null;

        }
    }




    const handleConfirmReservation = async (): Promise<void> => {


    }

    const reassignReservationSeats = async (scheduleId: number, customerId: number, oldSeats: number[], newSeats: number[]): Promise<void> => {
        const result = await window.electron.tickets.reassignSeats(scheduleId, customerId, oldSeats, newSeats);

        if (!result.ok) {
            showNofification({
                typeAlert: 'error',
                title: 'Error al reasignar asientos',
                message: result.error?.message || 'No fue posible reasignar los asientos, intenta nuevamente'
            });
            return;
        }

        showNofification({
            typeAlert: 'success',
            title: 'Asientos reasignados',
            message: 'Los asientos se reasignaron correctamente.'
        });

        // Refrescar la lista de reservaciones
        const lastDate = reservations.length > 0 ? reservations[0].reservation_date : '';
        if (lastDate) {
            await getReservationsByDate(lastDate);
        }
    }

    const payReservation = async (params: Reservation) => {


        console.log('front process pay reservation')


        const comfirmPay = await window.electron.processFlow.processConfirmedPurchase({
            customerId: params.customer_id,
            scheduleId: params.schedule_id,
            totalAmount: params.total_amount,
            paymentMethod: 'cash',
            seatNumbers: params.seats.split(',').map((s) => parseInt(s.trim(), 10))
        })


        if (!comfirmPay) return;

        showAlert({
            typeAlert: 'success',
            title: 'Reservación confirmada',
            message: 'Se ha registrado exitosamente el boleto.',
            btnAccept: 'Aceptar',
            callbackAcept: () => {
                //reiniciar estados y reducer para iniciar una nueva venta

            }

        })

        //actualizar la lista de reservaciones
        await getReservationsByDate(params.reservation_date);

    }

    const cancelReservation = async (reservation: Reservation, reason: string): Promise<void> => {
        const seatNumbers = reservation.seats.split(',').map(s => parseInt(s.trim(), 10));

        // Determinar si tiene purchase (reservación pagada)
        // Para reservaciones sin pagar, purchaseId es null
        // El backend determina el purchaseId consultando los tickets
        const purchaseId = reservation.ticket_status === 'occupied' ? null : null;

        const result = await window.electron.tickets.cancelReservation(
            reservation.schedule_id,
            seatNumbers,
            purchaseId,
            reason
        );

        if (!result.ok) {
            showNofification({
                typeAlert: 'error',
                title: 'Error al cancelar reservación',
                message: result.error?.detail || 'No fue posible cancelar la reservación, intenta nuevamente'
            });
            return;
        }

        showNofification({
            typeAlert: 'success',
            title: 'Reservación cancelada',
            message: `Se cancelaron ${seatNumbers.length} asiento(s) exitosamente.`
        });

        // Refrescar la lista de reservaciones
        await getReservationsByDate(reservation.reservation_date);
    }



    const backgrounTiketSale = 'bg-card text-card-foreground border border-border transition-colors';
    return (
        <ReservationContext.Provider value={{
            reservations,


            // stepsComfirmationReservation,
            // state,
            isLoading,
            // scheduleToSelection,
            // numberDeparturesToday,
            currentStep,
            // stepCompletedTravelTypeAndBookingType,
            // stepCompletedOrigenDestination,
            // stepCompletedSelectedDates,
            // isRoundTrip,
            backgrounTiketSale,
            // isReservation,
            // hasInapamPassengers,
            // totalPassengers,
            // stepCompletedPassengersSelection,

            // destinationSelected,
            // cityOrigin,
            // cityDestination,
            // vehicleForTripe,
            // seats,
            // selectedSchedule,
            seatColors,
            // stepCompletedSelectedSeats,
            // seatsSelected,

            // dispatch,
            showModalAlert: showAlert,
            showNofification,

            // handleSeatSelect,
            handleRegisterCustomer,
            // handleConfirmTicketSale,
            handleConfirmReservation,
            payReservation,
            getReservationsByDate,
            reassignReservationSeats,
            cancelReservation

        }}>
            {children}
        </ReservationContext.Provider>
    );
}

export function useReservation() {
    const ctx = useContext(ReservationContext);
    if (!ctx) throw new Error("No hay context reservation");

    return ctx;
}