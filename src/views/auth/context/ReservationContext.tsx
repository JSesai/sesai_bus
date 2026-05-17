import { createContext, useContext, useMemo, useReducer, useState } from "react";
import { useDashboard } from "./DashBoardContext";
import { formatDayMonth, getDayName } from "../../../shared/utils/helpers";
import showAlert, { type PropsModal } from "../../Modals/Modals";
import { Armchair, BookOpenCheck, Calendars, Contact, HandCoins, NotebookPen, TicketsPlane, UnfoldHorizontal, Users } from "lucide-react";
import type { Step } from "../../Buses/components/Steper";
import { toast } from "sonner";
import { initialStateTrip, tripReducer, type ActionTripReducer, type TripState } from "../../Buses/reducers/tripReducer";
import { estadosMexico } from "../../shared/constants/constants";
import type { Reservation } from "../../Buses/components/ComfirmationList";


export enum stepsReservationComfirm {
    comfirmationsList = 0,
    paymentReservation = 1,
}



type ReservationContextType = {
    //data
    isLoading: boolean;
    scheduleToSelection: Schedule[];
    numberDeparturesToday: number;
    state: TripState;
    stepsComfirmationReservation: Step[],
    currentStep: stepsReservationComfirm;
    stepCompletedTravelTypeAndBookingType: boolean;
    stepCompletedOrigenDestination: boolean;
    stepCompletedSelectedDates: boolean;
    isRoundTrip: boolean;
    backgrounTiketSale: string;
    isReservation: boolean;
    hasInapamPassengers: boolean;
    totalPassengers: number;
    stepCompletedPassengersSelection: boolean;
    stepCompletedSelectedSeats: boolean;
    noDepertureTime: boolean;
    destinationSelected: Route | null;
    cityOrigin: string;
    cityDestination: string;
    vehicleForTripe: Bus | null;
    seats: SeatData[];
    seatsSelected: number[];
    selectedSchedule: Schedule | null;
    seatColors: {
        available: string;
        selected: string;
        occupied: string;
        selectedTemporal: string;
    };

    //methods
    resetSteps: () => void;
    handleNext: () => void;
    handleBack: () => void;
    dispatch: React.Dispatch<ActionTripReducer>;
    showModalAlert: (props: PropsModal) => void
    showNofification: (props: PropsModal) => void;
    getReservationsByDate: (dateReservation: string) => Promise<void>;
    handleSeatSelect: (seatId: number) => void;
    handleRegisterCustomer: (customer: Customer, isSearch: boolean) => Promise<Customer | null>;
    handleConfirmTicketSale: () => Promise<void>;
    handleTicketSaleCard: () => void;
    handleConfirmReservation: () => Promise<void>;

};


export const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export function ReservationProvider({ children }: { children: React.ReactNode }) {


    const [reservations, setReservations] = useState<Reservation[]>([]);

    const [state, dispatch] = useReducer(tripReducer, initialStateTrip);
    const { vehicles, agencies, runningSchedules, destinations } = useDashboard();
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState<stepsReservationComfirm>(stepsReservationComfirm.comfirmationsList);
    const [seats, setSeats] = useState<SeatData[]>([]);
    const [stepCompletedSelectedSeats, setStepCompletedSelectedSeats] = useState(false);



    const destinationSelected = destinations.find((d) => d.id === state.idDestination) || null;
    const cityOrigin = agencies?.find((a) => a.id === state.idOrigin)?.city || "";
    const cityDestination = destinationSelected ? destinationSelected.cityName : "";
    const abbreviationOrigin = estadosMexico.find((e) => e.name === cityOrigin)?.abbr || "";
    const abbreviationDestination = destinationSelected && estadosMexico.find((e) => e.name === destinationSelected.cityName)?.abbr || "";
    const descriptionDestinationOrigin = destinationSelected ? `${abbreviationOrigin} - ${abbreviationDestination}` : "";
    const isRoundTrip = state.travelType === 'round-trip';
    const isReservation = state.bookingType === 'reserve';
    const stepCompletedTravelTypeAndBookingType = !!(state.bookingType && state.travelType);
    const stepCompletedOrigenDestination = !!(state.idOrigin && state.idDestination);
    const stepCompletedSelectedDates = !!(state.departureDate && (!isRoundTrip || (state.returnDate)));

    const hasInapamPassengers = state.passengers.inapam > 0;
    const totalPassengers = state.passengers.adults + state.passengers.children + state.passengers.inapam;
    const stepCompletedPassengersSelection = totalPassengers > 0;

    const descriptionDateSelected = stepCompletedSelectedDates ?
        `${formatDayMonth(state.departureDate)}` + (isRoundTrip ? `↔ ${formatDayMonth(state.returnDate)}` : "") : "";
    const seatsSelected = state.seats.map((s) => s.seat_number);
    const descriptionSeatselection = state.seats.length > 0 ? seatsSelected : undefined


    const stepsComfirmationReservation = useMemo<Step[]>(() => [
        { id: stepsReservationComfirm.comfirmationsList, label: "Reservaciones", icon: UnfoldHorizontal, description: descriptionDestinationOrigin },
        { id: stepsReservationComfirm.paymentReservation, label: "Pago", icon: HandCoins },
    ], [state]);



    const travelDay = getDayName(state.departureDate).toLowerCase();
    const scheduleToSelection = runningSchedules.filter((rs) => rs.daysOperation.includes(travelDay) && rs.route_id === state.idDestination);
    const selectedSchedule = scheduleToSelection.find((s) => s.id === state.idSchedule) || null;
    const noDepertureTime = scheduleToSelection.length === 0;
    const vehicleForTripe = vehicles.find((v) => v.id === selectedSchedule?.bus_id) || null;


    const seatColors = {
        available: "bg-green-200",
        selected: "bg-sky-600",
        occupied: "bg-gray-200",
        selectedTemporal: "bg-yellow-400",
    }
    console.warn({ destinationSelected });


    console.info({ travelDay });
    console.info({ runningSchedules });
    console.log({ scheduleToSelection });
    console.warn({ destinations });
    console.warn("value destination a setear es:::", state.idDestination);

    const numberDeparturesToday = scheduleToSelection.length;


    const resetSteps = () => setCurrentStep(0);
    const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, [stepsReservationComfirm].length - 1));
    const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0))


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


    const getReservationsByDate = async (dateReservation: string) => {
        const reservationsDate = await window.electron.tickets.getReservationsByDate(dateReservation);
        console.log({ reservationsDate });

        if (!reservationsDate.ok) {
            showNofification({
                typeAlert: 'error',
                title: 'Error al obtener reservaciones por fecha',
                message: reservationsDate.error?.message || 'No fue posible obtener información de la reservaciones, intenta nuevamente'
            })
            return
        }


        setReservations(reservationsDate.data);



    }

    //maneja la seleccion de asientos, actualizando el estado local de los asientos y la lista de asientos seleccionados en el estado global del tripReducer
    const handleSeatSelect = (seatId: number) => {
        console.log('con este vas a actualizar el estado de los asientos y la lista de seleccionados', seatId);
        const seatsSelected = seats.filter((s) => s.status === 'selected');
        if (totalPassengers === seatsSelected.length) {
            //si ya selecciono el numero maximo de asientos permitido, solo permitir deseleccionar
            const isSelected = seats.find((s) => s.seat_number === seatId)?.status === 'selected';
            if (!isSelected) {
                showNofification({
                    duration: 3_000,
                    typeAlert: 'info',
                    title: 'Límite de asientos seleccionados',
                    message: `Número máximo de asientos permitidos (${totalPassengers}). Deselecciona un asiento para seleccionar otro.`
                })
                return;
            }
        }
        const updatedSeats: SeatData[] = seats.map((seat) => seat.seat_number === seatId ?
            { ...seat, status: seat.status === 'selected' ? "available" : "selected" }
            : seat
        );

        setSeats(updatedSeats);

        console.log({ seatsSelected });

        // Actualizar el estado global
        dispatch({
            type: "SET_FIELD",
            field: "seats",
            value: updatedSeats.filter((seat) => seat.status === "selected")
        });

    };


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


    const handleConfirmTicketSale = async (): Promise<void> => {

        const updateStatusTicket = await window.electron.processFlow.processConfirmedPurchase({
            customerId: state.customer?.id || 0,
            scheduleId: state.idSchedule,
            totalAmount: destinationSelected?.baseFare ? destinationSelected.baseFare * seatsSelected.length : 0,
            paymentMethod: 'cash',
            seatNumbers: seatsSelected
        })


        if (!updateStatusTicket) return;

        showAlert({
            typeAlert: 'success',
            title: 'Venta realizada',
            message: 'Se ha registrado exitosamente el boleto.',
            callbackAcept: () => {
                //reiniciar estados y reducer para iniciar una nueva venta
                dispatch({ type: 'RESET' });
                setSeats([]);
                setStepCompletedSelectedSeats(false);
                resetSteps();
            }

        })
    }

    const handleConfirmReservation = async (): Promise<void> => {


    }

    const handleTicketSaleCard = () => {
        //implementacion de cobro con tarjeta
        showNofification({
            typeAlert: 'info',
            title: 'Función no implementada',
            message: 'La función de cobro con tarjeta no está implementada en esta versión.'
        })
    }

    const backgrounTiketSale = 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-6 border-b border-slate-200 dark:border-slate-700/50 transition-colors';
    return (
        <ReservationContext.Provider value={{
            stepsComfirmationReservation,
            state,
            isLoading,
            scheduleToSelection,
            numberDeparturesToday,
            currentStep,
            stepCompletedTravelTypeAndBookingType,
            stepCompletedOrigenDestination,
            stepCompletedSelectedDates,
            isRoundTrip,
            backgrounTiketSale,
            isReservation,
            hasInapamPassengers,
            totalPassengers,
            stepCompletedPassengersSelection,
            noDepertureTime,
            destinationSelected,
            cityOrigin,
            cityDestination,
            vehicleForTripe,
            seats,
            selectedSchedule,
            seatColors,
            stepCompletedSelectedSeats,
            seatsSelected,

            dispatch,
            showModalAlert: showAlert,
            showNofification,
            resetSteps,
            handleNext,
            handleBack,
            handleSeatSelect,
            handleRegisterCustomer,
            handleConfirmTicketSale,
            handleTicketSaleCard,
            handleConfirmReservation,

            getReservationsByDate

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