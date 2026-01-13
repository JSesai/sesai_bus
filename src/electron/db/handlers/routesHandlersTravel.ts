import { ipcMain } from "electron";
import { routesTravelRepo } from "../repositories/routesTravelRepo.js";
import { AppError, DestinationRouteError } from "../../../shared/errors/customError.js";

export function registerRoutesHandlersTravel() {
  ipcMain.handle("getRoutes", async (): Promise<ResponseElectronGeneric> => {

    try {
      const routes = await routesTravelRepo.getAll()
      if (!routes) return { ok: false, data: null, error: { message: "No se obtuvo información", detail: "No hay routes debes agregar" } }
      return { ok: true, error: null, data: routes }
    } catch (error) {
      console.log(error);
      if (error instanceof DestinationRouteError) {
        return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };
      }

      return { ok: false, data: null, error: { message: "Error interno no esperado", detail: "No fue posible obtener la configuración" } };
    }


  });
  ipcMain.handle("getRouteById", (_, id: number) => routesTravelRepo.getById(id));
  ipcMain.handle("addRoute", async (_, route: Route): Promise<ResponseElectronGeneric> => {
    try {
      console.log('init process add route');

      const routeAdd = await routesTravelRepo.add(route)
      if (!routeAdd) return { ok: false, data: null, error: { message: "No se obtuvo información", detail: "No hay routes debes agregar" } }
      return { ok: true, error: null, data: routeAdd }
    } catch (error) {
      console.log(error);
      if (error instanceof DestinationRouteError) {
        return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };
      }

      return { ok: false, data: null, error: { message: "Error interno no esperado", detail: "No fue posible obtener la configuración" } };
    }

  });
  ipcMain.handle("updateRoute", async (_, route): Promise<ResponseElectronGeneric> => {
    try {
      console.log('init process update route');
      const routeUpdate = await routesTravelRepo.update(route);
      if (!routeUpdate) return { ok: false, data: null, error: { message: "No se obtuvo información", detail: "No actualizó route - destino" } }
      return { ok: true, error: null, data: routeUpdate }
    } catch (error) {
      console.log(error);
      if (error instanceof DestinationRouteError) {
        return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };
      }

      return { ok: false, data: null, error: { message: "Error interno no esperado", detail: "No fue posible actualizar route - destino" } };
    }


  });
  ipcMain.handle("deleteRoute", (_, id: number) => routesTravelRepo.delete(id));
}
