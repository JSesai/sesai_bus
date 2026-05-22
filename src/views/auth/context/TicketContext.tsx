


import { createContext, useContext, useMemo, useReducer, useState } from "react";
import { useDashboard } from "./DashBoardContext";
import { formatDayMonth, getDayName } from "../../../shared/utils/helpers";
import showAlert, { type PropsModal } from "../../Modals/Modals";
import { Armchair, BookOpenCheck, Calendars, Contact, HandCoins, NotebookPen, TicketsPlane, UnfoldHorizontal, Users } from "lucide-react";
import type { Step } from "../../Buses/components/Steper";
import { toast } from "sonner";
import { initialStateTrip, tripReducer, type ActionTripReducer, type TripState } from "../../Buses/reducers/tripReducer";
import { estadosMexico } from "../../shared/constants/constants";


export enum stepsTicketOffice {
    originAndDestinationSelection = 0,
    selectTravelTypeAndBookingType = 1,
    datesSelection = 2,
    infoCustomer = 3,
    passengersSelection = 4,
    seatSelection = 5,
    paymentOrReservatiion = 6,
    // PrintTicket = 7,
}



type TicketContextType = {
    //data
    isLoading: boolean;
    scheduleToSelection: Schedule[];
    numberDeparturesToday: number;
    state: TripState;
    stepsTicketSale: Step[],
    currentStep: stepsTicketOffice;
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
    getSeatStatus: () => Promise<void>;
    handleSeatSelect: (seatId: number) => void;
    handleRegisterCustomer: (customer: Customer, isSearch: boolean) => Promise<Customer | null>;
    handleRegisterTicket: () => Promise<void>;
    handleConfirmTicketSale: () => Promise<void>;
    handleTicketSaleCard: () => void;
    handleConfirmReservation: () => Promise<void>;

};


export const TicketContext = createContext<TicketContextType | undefined>(undefined);

export function TicketProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(tripReducer, initialStateTrip);
    const { vehicles, agencies, runningSchedules, destinations } = useDashboard();
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState<stepsTicketOffice>(stepsTicketOffice.originAndDestinationSelection);
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

    const descriptionTravelTypeAndBookingType = stepCompletedTravelTypeAndBookingType ? isRoundTrip ? "Redondo" : "Sencillo" : "";
    const descriptionDateSelected = stepCompletedSelectedDates ?
        `${formatDayMonth(state.departureDate)}` + (isRoundTrip ? `↔ ${formatDayMonth(state.returnDate)}` : "") : "";
    const seatsSelected = state.seats.map((s) => s.seat_number);
    const descriptionSeatselection = state.seats.length > 0 ? seatsSelected : undefined


    const stepsTicketSale = useMemo<Step[]>(() => [
        { id: stepsTicketOffice.originAndDestinationSelection, label: "Origen/Destino", icon: UnfoldHorizontal, description: descriptionDestinationOrigin },
        { id: stepsTicketOffice.selectTravelTypeAndBookingType, label: "Tipo de viaje", icon: BookOpenCheck, description: descriptionTravelTypeAndBookingType },
        { id: stepsTicketOffice.datesSelection, label: "Fecha", icon: Calendars, description: descriptionDateSelected },
        { id: stepsTicketOffice.infoCustomer, label: "Cliente", icon: Contact, description: state.customer ? state.customer.name.split(' ').slice(0, 2).join(' ') : '' },
        { id: stepsTicketOffice.passengersSelection, label: "Pasajeros", icon: Users, description: stepCompletedPassengersSelection ? String(totalPassengers) : '' },
        { id: stepsTicketOffice.seatSelection, label: "Asientos", icon: Armchair, description: JSON.stringify(descriptionSeatselection) },
        { id: stepsTicketOffice.paymentOrReservatiion, label: isReservation ? "Reservar" : "Pago", icon: isReservation ? NotebookPen : HandCoins },
        // { id: stepsTicketOffice.PrintTicket, label: "Impresión", icon: TicketsPlane },
    ], [state]);



    const travelDay = getDayName(state.departureDate).toLowerCase();
    const scheduleToSelection = runningSchedules.filter((rs) => rs.dateDeparture === state.departureDate && rs.route_id === state.idDestination);
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


    const resetSteps = () => setCurrentStep(stepsTicketOffice.originAndDestinationSelection);
    const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, stepsTicketOffice.paymentOrReservatiion))
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


    const getSeatStatus = async () => {
        const seatStatus = await window.electron.schedules.getVehicleSeatStatus(state.idSchedule);
        console.log({ seatStatus });

        if (!seatStatus.ok) {
            showNofification({
                typeAlert: 'error',
                title: 'Error al obtener asientos',
                message: seatStatus.error?.message || 'No fue posible obtener el estado de los asientos, intenta nuevamente'
            })
            return
        }

        if (state.seats.length > 0) {
            //si ya hay asientos seleccionados, conservar esa seleccion en el nuevo estado de los asientos obtenido de la base de datos
            const updatedSeats = seatStatus.data.map((seat: SeatData) => {
                const isSelected = state.seats.some((s) => s.seat_number === seat.seat_number && s.status === 'selected');
                return isSelected ? { ...seat, status: 'selected' } : seat;
            });
            setSeats(updatedSeats);
            return;
        }

        setSeats(seatStatus.data);



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

    //todo validar cuando se haga la peticion por el web service, ya que puede dar error si otro punto de venta ya selecciono esos asientos, manejar ese error mostrando una notificacion al usuario y refrescando el estado de los asientos disponibles
    const handleRegisterTicket = async () => {
        //aqui va la logica para registrar el ticket en la base de datos, con toda la informacion del estado global (state) y los asientos seleccionados (seats)
        const result = await window.electron.tickets.insertSelectedSeats({
            customerId: state.customer?.id || 0,
            price: destinationSelected?.baseFare || 0,
            scheduleId: state.idSchedule,
            seatNumbers: seatsSelected,

        });
        console.log({ insertSelectedSeats: result });

        if (!result.ok) {
            showNofification({
                typeAlert: 'error',
                title: 'Error al registrar asientos',
                message: result.error?.message || 'No fue posible registrar los asientos seleccionados, intenta nuevamente'
            })

            //actualizar estato de los asientos para reflejar que los asientos seleccionados ya no estan disponibles
            await getSeatStatus();

            return;

        }

        //actualizar estado par marcar el paso como completado
        setStepCompletedSelectedSeats(true);
        //avanza al siguiente paso
        handleNext();
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

        const updateStatusTicket = await window.electron.tickets.updateTicketStatus(state.idSchedule, seatsSelected, 'reserved');

        if (!updateStatusTicket.ok) {
            showNofification({
                typeAlert: 'error',
                title: 'Error al confirmar reservación',
                message: updateStatusTicket.error?.message || 'No fue posible confirmar la reservación, intenta nuevamente'
            })

            //actualizar estato de los asientos para reflejar que los asientos seleccionados ya no estan disponibles
            await getSeatStatus();

            return;
        }

        showAlert({
            typeAlert: 'success',
            title: 'Reservación realizada',
            message: 'Se ha reservado exitosamente el boleto.',
            callbackAcept: () => {
                //reiniciar estados y reducer para iniciar una nueva venta
                dispatch({ type: 'RESET' });
                setSeats([]);
                setStepCompletedSelectedSeats(false);
                resetSteps();
            }

        })
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
        <TicketContext.Provider value={{
            stepsTicketSale,
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
            getSeatStatus,
            handleSeatSelect,
            handleRegisterCustomer,
            handleRegisterTicket,
            handleConfirmTicketSale,
            handleTicketSaleCard,
            handleConfirmReservation

        }}>
            {children}
        </TicketContext.Provider>
    );
}

export function useTicket() {
    const ctx = useContext(TicketContext);
    if (!ctx) throw new Error("No hay context ticket");

    return ctx;
}