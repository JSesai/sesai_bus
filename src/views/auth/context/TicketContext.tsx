


import { createContext, useContext, useMemo, useReducer, useState } from "react";
import { useDashboard } from "./DashBoardContext";
import { formatDayMonth, getDayName } from "../../../shared/utils/helpers";
import showAlert, { type PropsModal } from "../../Modals/Modals";
import { Armchair, BookOpenCheck, Calendars, Contact, HandCoins, TicketsPlane, UnfoldHorizontal, Users } from "lucide-react";
import type { Step } from "../../Buses/components/Steper";
import { toast } from "sonner";
import { initialStateTrip, tripReducer, type ActionTripReducer, type TripState } from "../../Buses/reducers/tripReducer";
import { estadosMexico } from "../../shared/constants/constants";

export enum stepsTicketOffice {
    originAndDestinationSelection = 0,
    selectTravelTypeAndBookingType = 1,
    datesSelection = 2,
    passengersSelection = 3,
    seatSelection = 4,
    infoCustomer = 5,
    pay = 6,
    PrintTicket = 7,
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
    noDepertureTime: boolean;
    destinationSelected: Route | null;
    cityOrigin: string;
    cityDestination: string;
    vehicleForTripe: Bus | null;
    seats: SeatData[];

    //methods
    resetSteps: () => void;
    handleNext: () => void;
    handleBack: () => void;
    dispatch: React.Dispatch<ActionTripReducer>;
    showModalAlert: (props: PropsModal) => void
    showNofification: (props: PropsModal) => void;
    getSeatStatus: () => Promise<void>;
    handleSeatSelect: (seatId: number) => void;

};


export const TicketContext = createContext<TicketContextType | undefined>(undefined);

export function TicketProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(tripReducer, initialStateTrip);
    const { vehicles, agencies, runningSchedules, destinations } = useDashboard();
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState<stepsTicketOffice>(stepsTicketOffice.originAndDestinationSelection);
    const [seats, setSeats] = useState<SeatData[]>([])

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


    const stepsTicketSale = useMemo<Step[]>(() => [
        { id: stepsTicketOffice.originAndDestinationSelection, label: "Origen/Destino", icon: UnfoldHorizontal, description: descriptionDestinationOrigin },
        { id: stepsTicketOffice.selectTravelTypeAndBookingType, label: "Tipo de viaje", icon: BookOpenCheck, description: descriptionTravelTypeAndBookingType },
        { id: stepsTicketOffice.datesSelection, label: "Fecha", icon: Calendars, description: descriptionDateSelected },
        { id: stepsTicketOffice.passengersSelection, label: "Pasajeros", icon: Users, description: stepCompletedPassengersSelection ? String(totalPassengers) : '' },
        { id: stepsTicketOffice.seatSelection, label: "Asientos", icon: Armchair },
        { id: stepsTicketOffice.infoCustomer, label: "Cliente", icon: Contact },
        { id: stepsTicketOffice.pay, label: "Pago", icon: HandCoins, disabled: state.bookingType === "reserve" },
        { id: stepsTicketOffice.PrintTicket, label: "Impresión", icon: TicketsPlane },
    ], [state]);



    const travelDay = getDayName(state.departureDate).toLowerCase();
    const scheduleToSelection = runningSchedules.filter((rs) => rs.daysOperation.includes(travelDay) && rs.route_id === state.idDestination);
    const selectedSchedule = scheduleToSelection.find((s) => s.id === state.idSchedule) || null;
    const noDepertureTime = scheduleToSelection.length === 0;
    const vehicleForTripe = vehicles.find((v) => v.id === selectedSchedule?.bus_id) || null;
    console.warn({ destinationSelected });


    console.info({ travelDay });
    console.info({ runningSchedules });
    console.log({ scheduleToSelection });
    console.warn({ destinations });
    console.warn("value destination a setear es:::", state.idDestination);

    const numberDeparturesToday = scheduleToSelection.length;


    const resetSteps = () => setCurrentStep(stepsTicketOffice.originAndDestinationSelection);
    const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, stepsTicketOffice.PrintTicket))
    const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0))




    const showNofification = ({ typeAlert, message, title, duration }: PropsModal) => {

        switch (typeAlert) {
            case 'success':
                toast.success(title, {
                    description: message,
                    richColors: true,
                    duration: duration ? duration : 8_000,
                    position: 'top-center'
                })
                break;

            case 'error':
                toast.error(title, {
                    richColors: true,
                    description: message,
                    duration: duration ? duration : 10_000,
                    position: 'top-center'
                })
                break;

            case 'info':
                toast.info(title, {
                    description: message,
                    richColors: true,
                    duration: duration ? duration : 8_000,
                    position: 'top-center'
                })
                break;

            default:
                toast(message, {
                    description: message,
                    richColors: true,
                    duration: duration ? duration : 10_000,
                    position: 'top-center'
                })
                break;
        }


    }


    const getSeatStatus = async () => {
        const seatStatus = await window.electron.schedules.getVehicleSeatStatus(state.idSchedule);
        console.log({ seatStatus });
        if (seatStatus.ok && seatStatus.data) {
            setSeats(seatStatus.data);
        }
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
        setSeats((prevSeats) =>
            prevSeats.map((seat) =>
                seat.seat_number === seatId ? { ...seat, status: seat.status === 'selected' ? "available" : "selected" } : seat
            )
        );

        dispatch({ type: "SET_FIELD", field: "seats", value: seatsSelected });

    };



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

            dispatch,
            showModalAlert: showAlert,
            showNofification,
            resetSteps,
            handleNext,
            handleBack,
            getSeatStatus,
            handleSeatSelect

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