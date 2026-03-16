import { ipcMain } from "electron";
import { agenciesRepo } from "../repositories/agenciesRepo.js";

export function registerAgenciesHandlers() {
  ipcMain.handle("getAgencies", async (_e): Promise<ResponseElectronGeneric> => {
    try {
      console.log("init process getAgencie");

      const agency = await agenciesRepo.getAgencies();
      if(!agency) return { ok: false, data: null, error: {message: "No existe agencia registrada", detail: "Registra una agencia"} }

      return { ok: true, data: agency, error: null }

    } catch (error) {
      console.log('error al obtener agencie ->', error);

      return { ok: false, data: null, error: { message: "Error interno", detail: "No fue posible actualizar el bus" } };

    }

  });
  ipcMain.handle("getAgencyLocal", async (_e): Promise<ResponseElectronGeneric> => {
    try {
      console.log("init process getAgencieLocal");

      const agencyLocal = await agenciesRepo.getCurrent();

      if(!agencyLocal) return { ok: false, data: null, error: {message: "No existe agencia registrada", detail: "Registra una agencia"} }

      return { ok: true, data: agencyLocal, error: null }

    } catch (error) {
      console.log('error al obtener agencie ->', error);

      return { ok: false, data: null, error: { message: "Error interno", detail: "No fue posible actualizar el bus" } };

    }

  });
  ipcMain.handle("addAgency", async(_, agency: Agency): Promise<ResponseElectronAgencie> => {
    try {
      console.log("init process add agency");
      
      
      const data = await agenciesRepo.add(agency) as Agency;
      

      return { ok: true, data, error: null }
    
    } catch (error) {
      console.log('error al obtener agencie ->', error);

      return { ok: false, data: null, error: { message: "Error interno", detail: "No fue posible crear información agency" } };

    }
  });

  ipcMain.handle("updateAgency", async(_, agency):  Promise<ResponseElectronGeneric> => {

      try {
      console.log("init process update agency");
      
      const data = await  agenciesRepo.update(agency)
      return { ok: true, data: agency, error: null }

    } catch (error) {
      console.log('error al actualizar agencie ->', error);

      return { ok: false, data: null, error: { message: "Error interno", detail: "No fue posible actualizar información agency" } };

    }
   
  
  });
  ipcMain.handle("deleteAgency", (_, id: number) => agenciesRepo.delete(id));
}
