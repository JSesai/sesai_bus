import { ipcMain } from "electron";
import { schedulesRepo } from "../repositories/schedulesRepo.js";
import { ScheduleError } from "../../../shared/errors/customError.js";
import { isCurrentAgency, isSuperUser } from "../../utils/helpers.js";

export function registerSchedulesHandlers() {
    ipcMain.handle("getSchedules", async (): Promise<ResponseElectronGeneric> => {

        try {
            const schedules = await schedulesRepo.getAll();
            console.log('schedules ->', schedules);

            if (!schedules) throw new ScheduleError("No se obtuvieron horarios. Debes registrar nuevo horario")
            return { ok: true, error: null, data: schedules }

        } catch (error: any) {

            if (error instanceof ScheduleError) {
                return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };
            }

            // if (error?.code === 'SQLITE_CONSTRAINT' && error.message.includes('routes.terminalName')) {
            //     return { ok: false, data: null, error: { message: 'La terminal destino ya se encuentra registrada', detail: 'Cambia el nombre de la terminal destino' } };
            // }
            console.log('error en getSchedules', error);
            return { ok: false, data: null, error: { message: "Error interno no esperado", detail: "No fue posible obtener schedule - horario" } };
        }

    });

    // ipcMain.handle("getScheduleById", async(_, id: Schedule['id']) => schedulesRepo.getById(id)); este es un camnbio
    ipcMain.handle("addSchedule", async (_, schedule: Schedule) => {

        try {
            console.log('init process add schedule', schedule);
            if (!schedule.route_id || !schedule.driver_id || !schedule.departure_time ||
                !schedule.bus_id || !schedule.arrival_time || !schedule.agency_id_origin || !schedule.vehicle_number ||
                !schedule.status || !schedule.dateDeparture
            ) {
                throw new ScheduleError("No se pudo agregar horario faltan datos por  completar")

            }
            const isAgencyLocal = await isCurrentAgency(schedule.agency_id_origin);
            if (!isAgencyLocal && !isSuperUser()) throw new ScheduleError("No se pudo agregar horario.", "No tienes permisos para agregar horarios de otras agencias.");
            const scheduleResponse = await schedulesRepo.add(schedule);
            console.log('schedules create ->', scheduleResponse);

            if (!scheduleResponse) throw new ScheduleError("No se pudo agregar horario.");


            return { ok: true, error: null, data: scheduleResponse }

        } catch (error: any) {

            if (error instanceof ScheduleError) {
                return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };
            }

            if (error?.code === 'SQLITE_CONSTRAINT' && error.message.includes('schedules.vehicle_number')) {
                return { ok: false, data: null, error: { message: 'El número de vehiculo ya se encuentra asignado a otra salida', detail: 'Cambia el el numero de vehiculo' } };
            }
            if (error?.code === 'SQLITE_CONSTRAINT' && error.message.includes('schedules.bus_id')) {
                return { ok: false, data: null, error: { message: 'Seleccione otro vehículo', detail: 'El vehículo elegido ya se encuentra asignado a otra salida' } };
            }
            console.log('error en addSchedule', error);
            return { ok: false, data: null, error: { message: "Error interno no esperado", detail: "No fue posible agregar horario" } };
        }


    });
    ipcMain.handle("updateSchedule", async (_, schedule: Schedule) => {

        try {
            console.log('init process update schedule', schedule);
            if (!schedule.route_id || !schedule.driver_id || !schedule.departure_time || !schedule.bus_id || !schedule.arrival_time || !schedule.agency_id_origin)
                throw new ScheduleError("No se pudo actualizar horario faltan datos por  completar")
            const scheduleResponse = await schedulesRepo.update(schedule);
            console.log('schedules update ->', scheduleResponse);

            if (!scheduleResponse) throw new ScheduleError("No se pudo agregar horario.")
            return { ok: true, error: null, data: scheduleResponse }

        } catch (error: any) {

            if (error instanceof ScheduleError) {
                return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };
            }

            // if (error?.code === 'SQLITE_CONSTRAINT' && error.message.includes('routes.terminalName')) {
            //     return { ok: false, data: null, error: { message: 'La terminal destino ya se encuentra registrada', detail: 'Cambia el nombre de la terminal destino' } };
            // }
            console.log('error en addSchedule', error);
            return { ok: false, data: null, error: { message: "Error interno no esperado", detail: "No fue posible agregar schedule - horario" } };
        }


    });
    // ipcMain.handle("updateSchedule", (_, schedule) => schedulesRepo.update(schedule));
    ipcMain.handle("deleteSchedule", (_, id: number) => schedulesRepo.delete(id));


    ipcMain.handle("getVehicleSeatStatus", async (_e, bus): Promise<ResponseElectronGeneric> => {
        try {
            console.log("init process getVehicleSeatStatus");

            const response = await schedulesRepo.getVehicleSeatStatus(bus);

            return { ok: true, error: null, data: response }

        } catch (error: any) {
            console.log('error al obtner status de asientos ->', error);
            return { ok: false, data: null, error: { message: "Error interno", detail: "No fue posible consultar el status de los asientos del vehículo" } };

        }

    });

}
