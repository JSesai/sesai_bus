


import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { AgencyError, AppError, BusError, ValidationError } from "../../../shared/errors/customError";
import { useAuth } from "./AuthContext";
import { useDashboard } from "./DashBoardContext";
import { daysOfWeek } from "../../shared/constants/constants";
import { getDayName, getTodayDate } from "../../../shared/utils/helpers";
import showAlert, { type PropsModal } from "../../Modals/Modals";
import { routeDirectory } from "../../router/routes";


type Action =
    | { type: "SET_FIELD"; field: keyof TripState; value: any }
    | { type: "UPDATE_PASSENGERS"; passengers: Partial<PassengerCounts> }
    | { type: "RESET" };


type TicketContextType = {
    //data
    isLoading: boolean;
    runningSchedulesToday: Schedule[];
    numberDeparturesToday: number;
    state: TripState;

    //methods
    dispatch: React.Dispatch<Action>;
    showModalAlert: ({ typeAlert, message, title, btnAccept, btnCancel, callbackAcept, callbackCancel, options, }: PropsModal) => void
};


type travelType = "one-way" | "round-trip"

type PassengerCounts = {
    adults: number;
    children: number;
    inapam: number;
};

type TripState = {
    travelType: travelType | null;
    passengers: PassengerCounts;
    origin: string;
    destination: string;
    departureDate: string;
    departureTime: string;
    returnDate: string;
    returnTime: string;
    isLoading: boolean;
    success: boolean;
    bookingType: BookingType | null;
    totalPassengers: number;
};

export const initialState: TripState = {
    travelType: null,
    passengers: { adults: 0, children: 0, inapam: 0 },
    origin: "",
    destination: "",
    departureDate: getTodayDate(),
    departureTime: "",
    returnDate: "",
    returnTime: "",
    isLoading: false,
    success: false,
    bookingType: null,
    totalPassengers: 0,
};


const tripReducer = (state: TripState, action: Action): TripState => {
    console.log({ estatetes: state });

    switch (action.type) {
        case "SET_FIELD":
            return { ...state, [action.field]: action.value };

        case "UPDATE_PASSENGERS":
            const updatedPassengers = { ...state.passengers, ...action.passengers, };
            return {
                ...state,
                passengers: updatedPassengers,
                totalPassengers: updatedPassengers.adults + updatedPassengers.children + updatedPassengers.inapam,
            };

        case "RESET":
            return initialState;

        default:
            return state;
    }
}


export const TicketContext = createContext<TicketContextType | undefined>(undefined);

export function TicketProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(tripReducer, initialState);
    const { agency, runningSchedules } = useDashboard();
    const [isLoading, setIsLoading] = useState(false);


    const travelDay = getDayName(state.departureDate).toLowerCase();
    console.log({ travelDay });
    console.log({ runningSchedules });

    const runningSchedulesToday = runningSchedules.filter((r) => r.daysOperation.includes(travelDay))

    console.log({ runningSchedulesToday });

    const numberDeparturesToday = runningSchedulesToday.length;

    const esViewTicketSale = routeDirectory.pathsLocationDashboard.ticketSale === location.pathname;


    useEffect(()=> {
        //si no hay salida/corrida para el la fecha de salida seleccionada
        console.log({numberDeparturesToday: numberDeparturesToday === 0, esViewTicketSale});
        
        
        if (numberDeparturesToday === 0 && esViewTicketSale) {
            showAlert({
                typeAlert: 'info',
                title: `Sin salidas para el día ${travelDay}`,
                message: `No hay salidas programadas para el ${state.departureDate} . Por favor, revisa los horarios disponibles.`,
            })
        }

    },[travelDay, esViewTicketSale])



    return (
        <TicketContext.Provider value={{
            state,
            isLoading,
            runningSchedulesToday,
            numberDeparturesToday,
            dispatch,
            showModalAlert: showAlert,

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