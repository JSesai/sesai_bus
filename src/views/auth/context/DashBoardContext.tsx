import { createContext, useContext, useEffect, useState } from "react";
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { AgencyError, AppError, BusError, DestinationRouteError, ValidationError } from "../../../shared/errors/customError";
import { useAuth } from "./AuthContext";
import { isvalidHour } from "../../../shared/utils/helpers";

type DashboardContextType = {
    //data
    isLoading: boolean;
    agency: Agency | null;
    vehicles: Bus[];
    destinations: Route[];
    numberRegisteredVehicles: number;
    numberRegisteredDestinations: number;
    runningSchedules: Schedule[];
    numberRegisterSchedule: number;


    //methods
    handleRegisterBus: (dataBus: Bus, editingBus?: boolean, configInitial?: boolean) => Promise<boolean>;
    handleUpdateStatus: (dataBus: Bus, configInitial?: boolean) => Promise<boolean>;
    handleGetBuses: () => Promise<void>
    handleRegisterAgency: (agency: Agency, editingAgency?: boolean, configInitial?: boolean) => Promise<boolean>;
    handleRegisterRoute: (dataRoute: Route, editingRoute?: boolean, configInitial?: boolean) => Promise<boolean>;
    handleRegisterSchedules: (schedule: Schedule, editingSchedule?: boolean, configInitial?: boolean) => Promise<boolean>;
};

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {

    const { userLogged } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [agency, setAgency] = useState<Agency | null>(null);
    const [vehicles, setVehicles] = useState<Bus[]>([]);
    const [destinations, setDestinations] = useState<Route[]>([]);
    const [runningSchedules, setRunningSchedules] = useState<Schedule[]>([]);


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
                const vehiclesUpdate = editingBus ? vehicles.map(v => v.id === bus.id ? bus : v) : [...vehicles, resp.data];
                setVehicles(vehiclesUpdate);
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
            console.log('init proces register route', destination);
            console.log({ editingRoute });

            const { terminalName, cityName, address, contactPhone, estimatedTravelTime } = destination;
            // Validaciones
            if (!terminalName || !cityName || !address || !contactPhone || !estimatedTravelTime) throw new DestinationRouteError("Por favor completa todos los campos obligatorios");
            if (!isvalidHour(String(destination.estimatedTravelTime))) throw new DestinationRouteError("Tiempo estimado hacia el destino es invalido", "El formato requerido es HH:MM");

            const SendDestination = {
                ...destination,
                origin: agency?.city ?? ''
            };

            setIsLoading(true);
            const resp = editingRoute ? await window.electron.routesTravel.updateRoute(SendDestination) : await window.electron.routesTravel.addRoute(SendDestination);

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

                const updateDestinations = editingRoute ? destinations.map(d => d.id === destination.id ? destination : d) : [...destinations, resp.data];
                setDestinations(updateDestinations);
                return true;
            }

            if (resp.error) throw new DestinationRouteError(resp.error.message, resp.error?.detail);

        } catch (e) {
            console.log('error al agregar destino / route', e);

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

    //manejador para obtener buses
    const handleGetRoutes = async (): Promise<void> => {

        try {
            setIsLoading(true);
            const destinatios = await window.electron.routesTravel.getRoutes();
            console.log(destinatios);
            if (!destinatios.ok) {
                setDestinations([]);
                return;
            }

            setDestinations(destinatios?.data);

        } catch (e) {
            console.log('ocurrio un error al obtener los destinos', e);

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

    //manejador para obtener horariosde  salidas
    const handleGetSchedules = async (): Promise<void> => {

        try {
            setIsLoading(true);
            const schedules = await window.electron.schedules.getSchedules();
            console.log({ schedules });
            if (!schedules.ok) {
                setRunningSchedules([]);
                return;
            }

            setRunningSchedules(schedules?.data);

        } catch (e) {
            console.log('ocurrio un error al obtener los horarios', e);

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

    //manejador para crear/actualizar horarios
    const handleRegisterSchedules = async (schedule: Schedule, editingSchedule: boolean = false, configInitial = false): Promise<boolean> => {

        try {
            setIsLoading(true);
            const schedules = editingSchedule ? await window.electron.schedules.updateSchedule(schedule) : await window.electron.schedules.addSchedule(schedule);
            console.log({ schedules });
            if (!schedules.ok) return false;
            setRunningSchedules(schedules?.data);
            return true;

        } catch (e) {
            console.log('ocurrio un error al obtener los horarios', e);

            if (e instanceof AppError) {

                toast.error(e.message, {
                    richColors: true,
                    description: e.details,
                    duration: 10_000,
                    position: 'top-center'
                });
            }
            return false;

        } finally {
            setIsLoading(false);
        }
    }

    const loadSystemInformation = async () => {
        try {

            //multiples peticiones para traer informacion del sistema busesm horarios, clientes, ventas, etc...
            const results = await Promise.allSettled([getAgency(), handleGetBuses(), handleGetRoutes(), handleGetSchedules()]);
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
            handleRegisterSchedules,
            destinations,
            runningSchedules,
            vehicles,
            isLoading,
            agency,
            numberRegisteredVehicles: vehicles.length,
            numberRegisteredDestinations: destinations.length,
            numberRegisterSchedule: runningSchedules.length


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