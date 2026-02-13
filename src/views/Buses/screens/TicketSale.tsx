import { useState } from "react";
import { useTicket } from "../../auth/context/TicketContext";
import TicketBookingForm from "../components/TicketBookingForm";


export type handlerSteps = {
    onNext?: () => void;
    onBack?: () => void;
}



enum stepsTicketOffice {
    dataTravel = 0,
    seatSelection = 1,
    pay = 2,
    PrintTicket = 3,
}


export function TicketSale() {

    const { isLoading } = useTicket();
    const [step, setStep] = useState<stepsTicketOffice>(stepsTicketOffice.dataTravel)

    const next = () => setStep((s) => Math.min(s + 1, stepsTicketOffice.PrintTicket));
    const back = () => setStep((s) => Math.max(s - 1, stepsTicketOffice.dataTravel));




    return (
        <>

            {
                step === stepsTicketOffice['dataTravel'] &&  < TicketBookingForm />

            }

           


        </>
    )
}