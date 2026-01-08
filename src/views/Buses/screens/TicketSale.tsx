import { useTicket } from "../../auth/context/TicketContext";
import TicketBookingForm from "../components/TicketBookingForm";



export function TicketSale() {

    const { isLoading } = useTicket();

    console.log('esta en load', isLoading);


    return (
        <TicketBookingForm />
    )
}