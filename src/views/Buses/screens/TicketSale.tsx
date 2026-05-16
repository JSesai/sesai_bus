import { useState } from "react";
import { stepsTicketOffice, useTicket } from "../../auth/context/TicketContext";
import Stepper from "../components/Steper";
import TravelTypeAndBookingType from "../components/TravelTypeAndBookingType";
import TravelDates from "../components/TravelDates";
import PairButtons from "../components/PairButtons";
import OrigenAndDestination from "../components/OrigenAndDestination";
import Passengers from "../components/Passengers";
import { SeatSelection } from "../components/SeatSelection";
import InfoCustomer from "../components/InfoCustomer";
import Payment from "../components/Payment";
import ReservationComfirmation from "./ReservationComfirmation";


export type handlerSteps = {
    onNext?: () => void;
    onBack?: () => void;
}




export function TicketSale() {

    const { stepsTicketSale, stepCompletedTravelTypeAndBookingType, stepCompletedOrigenDestination, state,
        stepCompletedSelectedDates, stepCompletedPassengersSelection, currentStep, stepCompletedSelectedSeats,
        isReservation, seatsSelected, totalPassengers,
        resetSteps, handleNext, handleBack
    } = useTicket();


    console.log('::;;;', state);

    //construir ejecutor de validaciones
    const isBlockedAdvance = (): boolean => {
        if (currentStep === stepsTicketOffice['originAndDestinationSelection'] && stepCompletedOrigenDestination) return false;
        if (currentStep === stepsTicketOffice['selectTravelTypeAndBookingType'] && stepCompletedTravelTypeAndBookingType) return false;
        if (currentStep === stepsTicketOffice['datesSelection'] && stepCompletedSelectedDates && state.idSchedule !== 0) return false;
        if (currentStep === stepsTicketOffice['infoCustomer'] && state.customer) return false;
        if (currentStep === stepsTicketOffice['passengersSelection'] && stepCompletedPassengersSelection) return false;
        if (currentStep === stepsTicketOffice['seatSelection'] && stepCompletedSelectedSeats && seatsSelected.length === totalPassengers) return false;

        console.info('va a retornar true');
        return true;

    }



    return (
        <>
            {/* pasos del flujo */}
            <Stepper steps={stepsTicketSale} currentStep={currentStep} />

            {/* componentes a renderizar controlado por los pasos */}
            <div className="mt-10">
                {currentStep === stepsTicketOffice['originAndDestinationSelection'] && < OrigenAndDestination />}
                {currentStep === stepsTicketOffice['selectTravelTypeAndBookingType'] && < TravelTypeAndBookingType />}
                {currentStep === stepsTicketOffice['datesSelection'] && <TravelDates resetSteps={resetSteps} />}
                {currentStep === stepsTicketOffice['infoCustomer'] && <InfoCustomer />}
                {currentStep === stepsTicketOffice['passengersSelection'] && <Passengers />}
                {currentStep === stepsTicketOffice['seatSelection'] && <SeatSelection />}
                {currentStep === stepsTicketOffice['paymentOrReservatiion'] && (isReservation ? <ReservationComfirmation /> : <Payment />)}

            </div>


            {/* Controles */}
            <PairButtons
                clickBtnPrimary={handleNext}
                clickBtnSecondary={handleBack}
                btnPrimarytDisabled={isBlockedAdvance()}
                labelBtnPrimary="Siguiente"
                labelBtnBSecondary="Regresar"
            />



        </>
    )
}