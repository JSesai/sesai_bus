


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

    const validateOperationalData = async () => {

        try {

            // Validaciones - mostrar modal grandote
            if (!agency) throw new ValidationError("El administrador debe", "registrar los datos de la agencia");

            setIsLoading(true);
         
        
            
        } catch (e) {
            if (e instanceof AppError) {

                toast.error(e.message, {
                    richColors: true,
                    description: e.details,
                    duration: 10_000,
                    position: 'top-center'
                });
                return false;
            }

        } finally {
            setIsLoading(false)
        }

    }

    // get agencia
    useEffect(() => {
        validateOperationalData();
    }, []);

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