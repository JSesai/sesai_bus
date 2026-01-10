import { ipcMain } from "electron";
import { busesRepo } from "../repositories/busesRepo.js";
import { AppError, BusError } from "../../../shared/errors/customError.js";

export function busesHandlers() {
  ipcMain.handle("getBuses", async (): Promise<ResponseElectronGeneric> => {
    try {
      const buses = await busesRepo.getAll();
      const busesFilters = Array.isArray(buses) ? buses.filter(bus => bus.status !== 'removed') : [];
      console.log('buses registrados', buses);
      console.log('buses busesFilters', busesFilters);
      return { ok: true, data: busesFilters, error: null }

    } catch (error) {
      console.log('error al obtener autobus ->', error);

      if (error instanceof AppError) {
        return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };
      }

      return { ok: false, data: null, error: { message: "Error interno", detail: "No fue posible obtener los automobiles" } };


    }

  });
  ipcMain.handle("getBusById", (_e, id: number) => busesRepo.getById(id));
  ipcMain.handle("addBus", async (_e, bus: Bus): Promise<ResponseElectronGeneric> => {

    try {

      const registerBus = await busesRepo.add(bus);
      console.log({ registerBus });

      if (!registerBus) throw new BusError("Error al crear registro", "No se ha registrado autobus");
      return { ok: true, error: null, data: registerBus }
    } catch (error: any) {
      console.log('error al registrar autobus ->', error);

      if (error instanceof AppError) {
        return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };
      }

      if (error?.code === 'SQLITE_CONSTRAINT' && error.message.includes('buses.plate')) {
        return { ok: false, data: null, error: { message: 'Placas ya registradas', detail: 'El número de placas ya está asociada a otro autobus' } };
      }
      if (error?.code === 'SQLITE_CONSTRAINT' && error.message.includes('buses.serialNumber')) {
        return { ok: false, data: null, error: { message: 'Número de serie ya registrado', detail: 'El número de serie ya está asociada a otro autobus' } };
      }
      if (error?.code === 'SQLITE_CONSTRAINT' && error.message.includes('buses.number')) {
        return { ok: false, data: null, error: { message: 'Numero ya esta registrado', detail: 'El número de autobus ya está asociada a otro autobus' } };
      }


      return { ok: false, data: null, error: { message: "Error interno", detail: "No fue posible agregar el bus" } };
    }

  });
  ipcMain.handle("updateBus", async (_e, bus): Promise<ResponseElectronGeneric> => {
    try {
      console.log("init process update bus");

      const response = await busesRepo.update(bus);

      return { ok: true, error: null, data: response }

    } catch (error) {
      console.log('error al actualizar bus ->', error);

      return { ok: false, data: null, error: { message: "Error interno", detail: "No fue posible actualizar el bus" } };

    }

  });
  ipcMain.handle("getDailyBusAssignments", async (_e, params: { terminalId: number; date: string }): Promise<ResponseElectronGeneric> => {
    try {
      console.log("init process getDailyBusAssignments");

      const { terminalId, date } = params;

      const data = await busesRepo.getDailyAssignments(terminalId, date);

      return { ok: true, data, error: null }

    } catch (error) {
      console.log('error al actualizar bus ->', error);

      return { ok: false, data: null, error: { message: "Error interno", detail: "No fue posible actualizar el bus" } };

    }

  });
  ipcMain.handle("deleteBus", (_e, id: number) => busesRepo.delete(id));
}
