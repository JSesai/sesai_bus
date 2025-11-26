import { ipcMain } from "electron";
import { driversRepo } from "../repositories/driversRepo.js";

export function registerDriversHandlers() {
  ipcMain.handle("getDrivers", () => driversRepo.getAll());
  ipcMain.handle("getDriverById", (_, id: number) => driversRepo.getById(id));
  ipcMain.handle("addDriver", (_, driver) => driversRepo.add(driver));
  ipcMain.handle("updateDriver", (_, driver) => driversRepo.update(driver));
  ipcMain.handle("deleteDriver", (_, id: number) => driversRepo.delete(id));
}
