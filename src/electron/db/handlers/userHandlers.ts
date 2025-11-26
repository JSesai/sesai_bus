import { ipcMain } from "electron";
import { userRepo } from "../repositories/userRepo.js";

export function registerUserHandlers() {
    // ipcMain.handle("getUserById", (_, id) => userRepo.getById(id));
    ipcMain.handle("getById", async (_event, id: User['id']) => userRepo.getById(id));
    ipcMain.handle("getUsers", () => userRepo.getAll());
    ipcMain.handle("addUser", (_event, user) => userRepo.add(user));
    ipcMain.handle("updateUser", (_event, user) => userRepo.update(user));
    ipcMain.handle("deleteUser", (_event, id) => userRepo.delete(id));
}
