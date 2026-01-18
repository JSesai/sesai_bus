import { ipcMain } from "electron";
import { routesTravelRepo } from "../repositories/routesTravelRepo.js";
import { AppError, DestinationRouteError } from "../../../shared/errors/customError.js";
import { HHMMToTimestamp, timestamToHHMM } from "../../../shared/utils/helpers.js";

export function registerRoutesHandlersTravel() {
  ipcMain.handle("getRoutes", async (): Promise<ResponseElectronGeneric> => {

    try {
      const routes: Route[] = await routesTravelRepo.getAll()
      console.log('routes', routes);
      if (!routes) return { ok: false, data: null, error: { message: "No se obtuvo información", detail: "No hay routes debes agregar" } }
      const routesMaped = routes.map(route => ({ ...route, estimatedTravelTime: timestamToHHMM(Number(route.estimatedTravelTime)) || route.estimatedTravelTime }))
      return { ok: true, error: null, data: routesMaped }
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
      console.log('init process add route -->', route);
      const estimatedTravelTimeAtTimeStamp = HHMMToTimestamp(String(route.estimatedTravelTime));
      const routeAdd = await routesTravelRepo.add({ ...route, estimatedTravelTime: estimatedTravelTimeAtTimeStamp })
      if (!routeAdd) return { ok: false, data: null, error: { message: "No se obtuvo información", detail: "No hay routes debes agregar" } }
      return { ok: true, error: null, data: { ...routeAdd, estimatedTravelTime: route.estimatedTravelTime } }
    } catch (error: any) {
      console.log(error);
      if (error instanceof DestinationRouteError) {
        return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };
      }

      if (error?.code === 'SQLITE_CONSTRAINT' && error.message.includes('routes.terminalName')) {
        return {
          ok: false,
          data: null,
          error: {
            message: 'La terminal destino ya se encuentra registrada',
            detail: 'Cambia el nombre de la terminal destino'
          }
        };
      }


      return { ok: false, data: null, error: { message: "Error interno no esperado", detail: "No fue posible obtener la configuración" } };
    }

  });
  ipcMain.handle("updateRoute", async (_, route: Route): Promise<ResponseElectronGeneric> => {
    try {
      console.log('init process update route', route);
      if (!route.id) throw new DestinationRouteError("Falta id para poder actualizar destino");
      route.terminalName = route.terminalName.trim();
      const estimatedTravelTimeAtTimeStamp = HHMMToTimestamp(String(route.estimatedTravelTime));
      const routeUpdate = await routesTravelRepo.update({ ...route, estimatedTravelTime: estimatedTravelTimeAtTimeStamp });
      if (!routeUpdate) return { ok: false, data: null, error: { message: "No se obtuvo información", detail: "No actualizó route - destino" } }
      return { ok: true, error: null, data: { ...routeUpdate, estimatedTravelTime: route.estimatedTravelTime } }
    } catch (error: any) {
      console.log(error);
      if (error instanceof DestinationRouteError) {
        return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };
      }

      if (error?.code === 'SQLITE_CONSTRAINT' && error.message.includes('routes.terminalName')) {
        return { ok: false, data: null, error: { message: 'La terminal destino ya se encuentra registrada', detail: 'Cambia el nombre de la terminal destino' } };
      }

      return { ok: false, data: null, error: { message: "Error interno no esperado", detail: "No fue posible actualizar route - destino" } };

    }


  });
  ipcMain.handle("deleteRoute", (_, id: number) => routesTravelRepo.delete(id));
}
