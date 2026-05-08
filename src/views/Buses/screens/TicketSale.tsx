import { useState } from "react";
import { stepsTicketOffice, useTicket } from "../../auth/context/TicketContext";
import Stepper from "../components/Steper";
import TravelTypeAndBookingType from "../components/TravelTypeAndBookingType";
import TravelDates from "../components/TravelDates";
import PairButtons from "../components/PairButtons";
import OrigenAndDestination from "../components/OrigenAndDestination";
import Passengers from "../components/Passengers";
import { SeatSelection } from "../components/SeatSelection";


export type handlerSteps = {
    onNext?: () => void;
    onBack?: () => void;
}




export function TicketSale() {

    const { stepsTicketSale, stepCompletedTravelTypeAndBookingType, stepCompletedOrigenDestination, state,
        stepCompletedSelectedDates, stepCompletedPassengersSelection, currentStep, resetSteps, handleNext, handleBack
    } = useTicket();


    console.log({ stepCompletedTravelTypeAndBookingType });

    //construir ejecutor de validaciones
    const isBlockedAdvance = (): boolean => {
        if (currentStep === stepsTicketOffice['originAndDestinationSelection'] && stepCompletedOrigenDestination) return false;
        if (currentStep === stepsTicketOffice['selectTravelTypeAndBookingType'] && stepCompletedTravelTypeAndBookingType) return false;
        if (currentStep === stepsTicketOffice['datesSelection'] && stepCompletedSelectedDates && state.idSchedule !== 0) return false;
        if (currentStep === stepsTicketOffice['passengersSelection'] && stepCompletedPassengersSelection) return false;
        if (currentStep === stepsTicketOffice['seatSelection'] && state.seats.length > 0) return false;

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
                {currentStep === stepsTicketOffice['passengersSelection'] && <Passengers />}
                {currentStep === stepsTicketOffice['seatSelection'] && <SeatSelection />}

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