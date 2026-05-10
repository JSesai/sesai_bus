import { getTodayDate } from "../../../shared/utils/helpers";


export type travelType = "one-way" | "round-trip"
export type PassengerCounts = {
    adults: number;
    children: number;
    inapam: number;
};

export type TripState = {
    travelType: travelType | null;
    passengers: PassengerCounts;
    idOrigin: number;
    idDestination: number;
    idSchedule: number;
    customer: Customer | null;
    departureDate: string;
    departureTime: string;
    returnDate: string;
    returnTime: string;
    isLoading: boolean;
    success: boolean;
    bookingType: BookingType | null;
    totalPassengers: number;
    seats: SeatData[];

};

export type ActionTripReducer =
    | { type: "SET_FIELD"; field: keyof TripState; value: any }
    | { type: "UPDATE_PASSENGERS"; passengers: Partial<PassengerCounts> }
    | { type: "RESET" };

export const initialStateTrip: TripState = {
    travelType: null,
    passengers: { adults: 0, children: 0, inapam: 0 },
    idOrigin: 0,
    idDestination: 0,
    departureDate: getTodayDate(),
    departureTime: "",
    returnDate: "",
    returnTime: "",
    isLoading: false,
    success: false,
    bookingType: null,
    totalPassengers: 0,
    seats: [],
    idSchedule: 0,
    customer: null,
};


export const tripReducer = (state: TripState, action: ActionTripReducer): TripState => {
    console.log({ estadoTripReducer: state });

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
            return initialStateTrip;

        default:
            return state;
    }
}


