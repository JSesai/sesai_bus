import { ipcMain } from "electron";
import { routesTravelRepo } from "../repositories/routesTravelRepo.js";

export function registerRoutesHandlersTravel() {
  ipcMain.handle("getRoutes", () => routesTravelRepo.getAll());
  ipcMain.handle("getRouteById", (_, id: number) => routesTravelRepo.getById(id));
  ipcMain.handle("addRoute", (_, route) => routesTravelRepo.add(route));
  ipcMain.handle("updateRoute", (_, route) => routesTravelRepo.update(route));
  ipcMain.handle("deleteRoute", (_, id: number) => routesTravelRepo.delete(id));
}
