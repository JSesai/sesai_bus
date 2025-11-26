import { ipcMain } from "electron";
import { schedulesRepo } from "../repositories/schedulesRepo.js";

export function registerSchedulesHandlers() {
    ipcMain.handle("getSchedules", () => schedulesRepo.getAll());
    ipcMain.handle("getScheduleById", (_, id: number) => schedulesRepo.getById(id));
    ipcMain.handle("addSchedule", (_, schedule) => schedulesRepo.add(schedule));
    ipcMain.handle("updateSchedule", (_, schedule) => schedulesRepo.update(schedule));
    ipcMain.handle("deleteSchedule", (_, id: number) => schedulesRepo.delete(id));
}
