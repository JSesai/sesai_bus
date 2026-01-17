import { ipcMain } from "electron";
import { schedulesRepo } from "../repositories/schedulesRepo.js";
import { ScheduleError } from "../../../shared/errors/customError.js";

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

    ipcMain.handle("getScheduleById", (_, id: number) => schedulesRepo.getById(id));
    ipcMain.handle("addSchedule", (_, schedule) => schedulesRepo.add(schedule));
    ipcMain.handle("updateSchedule", (_, schedule) => schedulesRepo.update(schedule));
    ipcMain.handle("deleteSchedule", (_, id: number) => schedulesRepo.delete(id));
}
