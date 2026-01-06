import { ipcMain } from "electron";
import { agenciesRepo } from "../repositories/agenciesRepo.js";

export function registerAgenciesHandlers() {
  ipcMain.handle("getAgency", async (_e): Promise<ResponseElectronGeneric> => {
    try {
      console.log("init process getAgencie");

      const agency = await agenciesRepo.getAgency();
      if(!agency) return { ok: false, data: null, error: null }

      return { ok: true, data: agency, error: null }

    } catch (error) {
      console.log('error al obtener agencie ->', error);

      return { ok: false, data: null, error: { message: "Error interno", detail: "No fue posible actualizar el bus" } };

    }

  });
  ipcMain.handle("addAgency", async(_, agency: Agency): Promise<ResponseElectronAgencie> => {
    try {
      console.log("init process getAgencie");
      
      
      const data = await agenciesRepo.add(agency) as Agency;
      

      return { ok: true, data, error: null }

    } catch (error) {
      console.log('error al obtener agencie ->', error);

      return { ok: false, data: null, error: { message: "Error interno", detail: "No fue posible actualizar el bus" } };

    }
  });
  ipcMain.handle("updateAgency", (_, agency) => agenciesRepo.update(agency));
  ipcMain.handle("deleteAgency", (_, id: number) => agenciesRepo.delete(id));
}
