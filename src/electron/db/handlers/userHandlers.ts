import { ipcMain } from "electron";
import { userRepo } from "../repositories/userRepo.js";

export function registerUserHandlers() {
    // ipcMain.handle("getUserById", (_, id) => userRepo.getById(id));
    ipcMain.handle("getById", async (_event, id: User['id']) => userRepo.getById(id));
    ipcMain.handle("getUsers", () => userRepo.getAll());
    ipcMain.handle("addUser", (_event, user) => userRepo.add(user));
    ipcMain.handle("updateUser", (_event, user) => userRepo.update(user));
    ipcMain.handle("deleteUser", (_event, id) => userRepo.delete(id));
    ipcMain.handle("authUser", async (_event, credentials) => {
        try {
            console.log('inicia process auth');

            const result = await userRepo.authUser(credentials)

            if (!result) {
                return { ok: false, error: "Credenciales incorrectas" };
            }

            return { ok: true, user: result };
        } catch (error) {
            console.log(error);

            return { ok: false, error: "Error interno" };
        }
    })
}
