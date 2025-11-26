import { ipcMain } from "electron";
import { busesRepo } from "../repositories/busesRepo.js";

export function registerBusesHandlers() {
  ipcMain.handle("getBuses", () => busesRepo.getAll());
  ipcMain.handle("getBusById", (_, id: number) => busesRepo.getById(id));
  ipcMain.handle("addBus", (_, bus) => busesRepo.add(bus));
  ipcMain.handle("updateBus", (_, bus) => busesRepo.update(bus));
  ipcMain.handle("deleteBus", (_, id: number) => busesRepo.delete(id));
}
