import { createContext, useContext, useEffect, useMemo, useState } from "react";
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { AgencyError, AppError, BusError, DestinationRouteError, ScheduleError, ValidationError } from "../../../shared/errors/customError";
import { useAuth } from "./AuthContext";
import { isvalidHour } from "../../../shared/utils/helpers";
import type { ScheduleFormData } from "../../Buses/components/ScheduleForm";
import type { UserForm } from "../screens/RegisterUser";



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
    employees: UserSample[];
    driverEmployees: UserSample[];
    numberRegisteredDriver: number;

    //methods
    handleRegisterBus: (dataBus: Bus, editingBus?: boolean, configInitial?: boolean) => Promise<boolean>;
    handleUpdateStatus: (dataBus: Bus, configInitial?: boolean) => Promise<boolean>;
    handleGetBuses: () => Promise<void>
    handleRegisterAgency: (agency: Agency, editingAgency?: boolean, configInitial?: boolean) => Promise<boolean>;
    handleRegisterRoute: (dataRoute: Route, editingRoute?: boolean, configInitial?: boolean) => Promise<boolean>;
    handleRegisterSchedules: (schedule: Schedule, editingSchedule?: boolean, configInitial?: boolean) => Promise<boolean>;
    handleRegisterUser: (user: UserForm, configInitial: boolean, isEditing: boolean) => Promise<boolean>;
    showConfetti: () => void;

};

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {

    const { userLogged } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [agency, setAgency] = useState<Agency | null>(null);
    const [vehicles, setVehicles] = useState<Bus[]>([]);
    const [destinations, setDestinations] = useState<Route[]>([]);
    const [runningSchedules, setRunningSchedules] = useState<Schedule[]>([]);
    const [employees, setEmployees] = useState<UserSample[]>([]);


    //mostrar confetti 
    const showConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 120,
            origin: { y: 0.6 }
        });
    }

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
                configInitial ?? showConfetti();

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
    //obtener empleados
    const getEmployees = async () => {
        try {
            const employees = await window.electron.users.getUsers();
            console.log({ employees });

            if (!employees.ok) throw new AgencyError("Error al obtener empleados", "valida existencia")

            setEmployees(employees.data);

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

            configInitial ?? showConfetti();

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
                configInitial ?? showConfetti();

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

    //Registro/acualizacion de usuario employee
    const handleRegisterUser = async (userAdd: UserForm, configInitial: boolean, isEditing: boolean): Promise<boolean> => {
        const { name, phone, role, userName } = userAdd;

        // Validaciones
        if (!name || !userName || !phone || !role) {
            toast.error("Por favor completa todos los campos", {
                richColors: true,
                duration: 10_000,
                position: 'top-center'
            })
            setIsLoading(false)
            return false;
        }

        if (name.length < 8) {
            toast.error("El nombre del usuario es muy corto", {
                richColors: true,
                duration: 10_000,
                position: 'top-center'
            })
            setIsLoading(false)
            return false;
        }

        if (phone.length < 10) {
            toast.error("El número de teléfono debe tener al menos 10 dígitos", {
                richColors: true,
                duration: 10_000,
                position: 'top-center'
            })
            setIsLoading(false)
            return false
        }

        try {
            const resp = isEditing ?
                await window.electron.users.updateUser({ ...userAdd, id: Number(userAdd.id) })
                :
                await window.electron.users.addUser({ ...userAdd, password: 'temporal123', })

            console.log(resp);
            if (resp.ok) {
                configInitial ?? showConfetti();

                toast.success('Registro exitoso.', {
                    description: isEditing ? 'Cuenta actualizada correctamente' : 'La cuenta ha sido creada correctamente',
                    richColors: true,
                    duration: 20_000,
                    position: 'top-center'
                })
                const employeesUpdated = isEditing ? employees.map(emp => emp.id === userAdd.id ? userAdd : emp) : [...employees, resp.data];
                console.log({ employeesUpdated });


                setEmployees(employeesUpdated);
                return true;

            }

            if (resp.error) {

                toast.error(resp.error.message, {
                    description: resp.error.detail,
                    richColors: true,
                    duration: 10_000,
                    position: 'top-center'
                })

            }

        } catch (e) {
            console.log(e);

        } finally {
            setIsLoading(false)
        }

        return false;

    }


    //manejador para crear/actualizar horarios
    const handleRegisterSchedules = async (sendSchedule: Schedule, editingSchedule: boolean = false, configInitial = false): Promise<boolean> => {

        try {
            setIsLoading(true);
            const scheduleRegister = editingSchedule ? await window.electron.schedules.updateSchedule(sendSchedule) : await window.electron.schedules.addSchedule(sendSchedule);
            console.log({ scheduleRegister });

            if (scheduleRegister.error) throw new ScheduleError(scheduleRegister.error.message, scheduleRegister.error.detail)

            setRunningSchedules(scheduleRegister?.data);
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
            const results = await Promise.allSettled([getAgency(), handleGetBuses(), handleGetRoutes(), handleGetSchedules(), getEmployees()]);
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


    const driverEmployees = useMemo(() => employees.filter(e => e.role === 'driver'), [employees]);
    console.log({ driverEmployees });



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
            handleRegisterUser,
            showConfetti,
            destinations,
            runningSchedules,
            vehicles,
            employees,
            isLoading,
            agency,
            numberRegisteredVehicles: vehicles.length,
            numberRegisteredDestinations: destinations.length,
            numberRegisterSchedule: runningSchedules.length,
            driverEmployees,
            numberRegisteredDriver: driverEmployees.length


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