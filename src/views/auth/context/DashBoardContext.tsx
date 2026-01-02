import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { AppError, BusError, ValidationError } from "../../../shared/errors/customError";

type DashboardContextType = {

    handleRegisterBus: (dataBus: Bus, editingBus?: boolean) => Promise<boolean>;
    isLoading: boolean;
};

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false)

    //manejador para registro de autobus 
    const handleRegisterBus = async (bus: Bus, editingBus: boolean = false): Promise<boolean> => {

        try {

            // Validaciones
            if (Object.values(bus).includes('')) throw new ValidationError("Ingresa todos los datos", "Hay campos obligatorios vacíos");

            if (bus.seatingCapacity <= 0) throw new BusError("Error", "La capacidad de asientos debe ser un número válido mayor a 0");

            const year = Number.parseInt(bus.year);
            const currentYear = new Date().getFullYear();
            if (isNaN(year) || year > currentYear + 1) throw new BusError("Año incorrecto", "El año no puede ser superior a 1 año de la fecha actual");
            const parsedNumber = Number(bus.number);

            if (Number.isNaN(parsedNumber)) throw new BusError("Número inválido", "El número del autobús debe ser numérico");
            bus.number = parsedNumber.toString();

            setLoading(true);
            const resp = editingBus ? await window.electron.buses.updateBus(bus) : await window.electron.buses.addBus(bus);

            console.log(resp);
            if (resp.ok) {
                confetti({
                    particleCount: 100,
                    spread: 120,
                    origin: { y: 0.6 }
                });

                toast.success(editingBus ? 'Cambios guardados' : 'Registro exitoso.', {
                    description: editingBus ? 'Automobil editado correctamente': 'Autobús agregado al sistema.',
                    richColors: true,
                    duration: 10_000,
                    position: 'top-center'
                })

                return true;
            }

            if (resp.error) throw new BusError(resp.error.message, resp.error.detail);

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
            setLoading(false)
        }

        return false;

    }


    return (
        <DashboardContext.Provider value={{
            handleRegisterBus,
            isLoading
        }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const ctx = useContext(DashboardContext);
    if (!ctx) {
        throw new Error("No hay context Auth");
    }
    return ctx;
}