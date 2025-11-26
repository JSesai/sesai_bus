import { ipcMain } from "electron";
import { agenciesRepo } from "../repositories/agenciesRepo.js";

export function registerAgenciesHandlers() {
  ipcMain.handle("getAgencies", () => agenciesRepo.getAll());
  ipcMain.handle("getAgencyById", (_, id: number) => agenciesRepo.getById(id));
  ipcMain.handle("addAgency", (_, agency) => agenciesRepo.add(agency));
  ipcMain.handle("updateAgency", (_, agency) => agenciesRepo.update(agency));
  ipcMain.handle("deleteAgency", (_, id: number) => agenciesRepo.delete(id));
}
