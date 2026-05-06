import { useState } from "react";
import { useTicket } from "../../auth/context/TicketContext";
import TicketBookingForm from "../components/TicketBookingForm";


export type handlerSteps = {
    onNext?: () => void;
    onBack?: () => void;
}



enum stepsTicketOffice {
    selectTravelType = 0,
    seatSelection = 1,
    pay = 2,
    PrintTicket = 3,
}


export function TicketSale() {

    const { isLoading } = useTicket();
    const [step, setStep] = useState<stepsTicketOffice>(stepsTicketOffice.selectTravelType)

    const next = () => setStep((s) => Math.min(s + 1, stepsTicketOffice.PrintTicket));
    const back = () => setStep((s) => Math.max(s - 1, stepsTicketOffice.selectTravelType));




    return (
        <>

            {
                step === stepsTicketOffice['selectTravelType'] && < TicketBookingForm />

            }




        </>
    )
}