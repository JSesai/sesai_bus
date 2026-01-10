import { createContext, useContext, useEffect, useState } from "react";
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { AgencyError, AppError, BusError, DestinationRouteError, ValidationError } from "../../../shared/errors/customError";
import { useAuth } from "./AuthContext";

type DashboardContextType = {
    //data
    isLoading: boolean;
    agency: Agency | null;
    vehicles: Bus[];
    destinations: Route[];
    numberRegisteredVehicles: number;
    numberRegisteredDestinations: number;


    //methods
    handleRegisterBus: (dataBus: Bus, editingBus?: boolean, configInitial?: boolean) => Promise<boolean>;
    handleUpdateStatus: (dataBus: Bus, configInitial?: boolean) => Promise<boolean>;
    handleGetBuses: () => Promise<void>
    handleRegisterAgency: (agency: Agency, editingAgency?: boolean, configInitial?: boolean) => Promise<boolean>;
    handleRegisterRoute: (dataRoute: Route, editingRoute?: boolean, configInitial?: boolean) => Promise<boolean>;
};

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {

    const { userLogged } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [agency, setAgency] = useState<Agency | null>(null);
    const [vehicles, setVehicles] = useState<Bus[]>([]);
    const [destinations, setDestinations] = useState<Route[]>([])


    //manejador para obtener buses
    const handleGetBuses = async (): Promise<void> => {

        try {
            setIsLoading(true);
            const buses = await window.electron.buses.getBuses();

            console.log(buses);
            if (!buses.ok) {
                setVehicles([]);
                return;
            }

            setVehicles(buses.data);



        } catch (e) {
            if (e instanceof AppError) {

                toast.error(e.message, {
                    richColors: true,
                    description: e.details,
                    duration: 10_000,
                    position: 'top-center'
                });
                return 
            }

        } finally {
            setIsLoading(false)
        }



    }
    //manejador para cambio de estatus de autobus 
    const handleUpdateStatus = async (bus: Bus): Promise<boolean> => {

        try {
            setIsLoading(true);
            const resp = await window.electron.buses.updateBus(bus);

            console.log(resp);
            if (resp.ok) {

                toast.success('Acción exitosa!!', {
                    richColors: true,
                    duration: 5_000,
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
            setIsLoading(false)
        }

        return false;

    }
    //manejador para registro de autobus 
    const handleRegisterBus = async (bus: Bus, editingBus: boolean = false, configInitial = false): Promise<boolean> => {

        try {

            // Validaciones
            if (Object.values(bus).includes('')) throw new ValidationError("Ingresa todos los datos", "Hay campos obligatorios vacíos");

            if (bus.seatingCapacity <= 0) throw new BusError("Error", "La capacidad de asientos debe ser un número válido mayor a 0");

            const year = Number.parseInt(bus.year);
            const currentYear = new Date().getFullYear();
            if (isNaN(year) || year > currentYear + 1) throw new BusError("Año incorrecto", "El año no puede ser superior a 1 año de la fecha actual");


            setIsLoading(true);
            const resp = editingBus ? await window.electron.buses.updateBus(bus) : await window.electron.buses.addBus(bus);

            console.log(resp);
            if (resp.ok) {
                configInitial ?? confetti({
                    particleCount: 100,
                    spread: 120,
                    origin: { y: 0.6 }
                });

                toast.success(editingBus ? 'Cambios guardados' : 'Registro exitoso.', {
                    description: editingBus ? 'Automobil editado correctamente' : 'Autobús agregado al sistema.',
                    richColors: true,
                    duration: 10_000,
                    position: 'top-center'
                })

                setVehicles([...vehicles, resp.data]);
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
            setIsLoading(false)
        }

        return false;

    }

    //obtener agencia
    const getAgency = async () => {
        try {
            const agencyData = await window.electron.agency.getAgency();
            console.log(agencyData);

            if (!agencyData.ok) throw new AgencyError("Error al obtener información", "valida existencia")

            setAgency(agencyData.data);

        } catch (error) {
            console.log('error al obtener agencia', error);

        }

    }

    //registrar o actualizar agencia
    const handleRegisterAgency = async (agencyForm: Agency, editingAgency: boolean = false, configInitial = false): Promise<boolean> => {

        try {
            console.log('hay agencia??', agency);

            // Validaciones
            if (Object.values(agencyForm).includes('')) throw new ValidationError("Ingresa todos los datos", "Hay campos obligatorios vacíos");

            if (agencyForm.name.length <= 3) throw new AgencyError("Error", "El nombre es demasiado corto");

            setIsLoading(true);
            const registerAgency = agency ? await window.electron.agency.updateAgency(agencyForm) : await window.electron.agency.addAgency(agencyForm);
            console.log(registerAgency);
            if (registerAgency.error) throw new AgencyError(registerAgency.error.message, registerAgency.error.detail);

            if (!registerAgency.ok) throw new AgencyError("Error inesperado", "Valida el registro de la agencia en el sistema");

            configInitial ?? confetti({
                particleCount: 100,
                spread: 120,
                origin: { y: 0.6 }
            });

            toast.success(agency ? 'Cambios guardados' : 'Registro exitoso.', {
                description: agency ? 'Agencia editada correctamente' : 'Agencia agregada al sistema.',
                richColors: true,
                duration: 5_000,
                position: 'top-center',

            })

            setAgency(registerAgency.data);
            return true;

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

        return false;

    }

    //manejador para registro de autobus 
    const handleRegisterRoute = async (destination: Route, editingRoute: boolean = false, configInitial = false): Promise<boolean> => {

        try {
            const { terminalName, cityName, address, contactPhone, estimatedTravelTime } = destination;
            // Validaciones
            if (!terminalName || !cityName || !address || !contactPhone || !estimatedTravelTime) throw new DestinationRouteError("Por favor completa todos los campos obligatorios")

            setIsLoading(true);
            const resp = editingRoute ? await window.electron.routeTravel.updateRoute(destination) : await window.electron.routeTravel.addRoute(destination);

            console.log(resp);
            if (resp.ok) {
                configInitial ?? confetti({
                    particleCount: 100,
                    spread: 120,
                    origin: { y: 0.6 }
                });

                toast.success(editingRoute ? 'Cambios guardados' : 'Registro exitoso.', {
                    description: editingRoute ? 'Destino editado correctamente' : 'Destino agregado al sistema.',
                    richColors: true,
                    duration: 10_000,
                    position: 'top-center'
                })

                setDestinations([...destinations, destination]);
                return true;
            }

            if (resp.error) throw new DestinationRouteError(resp.error.message, resp.error?.detail);

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

        return false;

    }


    const loadSystemInformation = async () => {
        try {

            //multiples peticiones para traer informacion del sistema busesm horarios, clientes, ventas, etc...
            const results = await Promise.allSettled([getAgency(), handleGetBuses()]);
            results.forEach((result, index) => {
                if (result.status === "fulfilled") {
                    console.log(`Petición ${index} OK:`, result.value);
                } else {
                    console.error(`Petición ${index} falló:`, result.reason);
                }
            });


        } catch (error) {
            console.log('error al obtener data system', error);

        }


    }





    // get agencia
    useEffect(() => {
        loadSystemInformation();
    }, [userLogged]);

    return (
        <DashboardContext.Provider value={{
            handleRegisterBus,
            handleUpdateStatus,
            handleGetBuses,
            handleRegisterAgency,
            handleRegisterRoute,
            destinations,
            vehicles,
            isLoading,
            agency,
            numberRegisteredVehicles: vehicles.length,
            numberRegisteredDestinations: destinations.length,


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