


import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { AgencyError, AppError, BusError, ValidationError } from "../../../shared/errors/customError";
import { useAuth } from "./AuthContext";
import { useDashboard } from "./DashBoardContext";

type TicketContextType = {
    //data
    isLoading: boolean;

    //methods

};

export const TicketContext = createContext<TicketContextType | undefined>(undefined);

export function TicketProvider({ children }: { children: React.ReactNode }) {

    const { agency,  } = useDashboard();
    const [isLoading, setIsLoading] = useState(false);



    return (
        <TicketContext.Provider value={{

            isLoading,

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