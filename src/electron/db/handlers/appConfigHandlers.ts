import { ipcMain } from "electron";
import { AppError } from '../../../shared/errors/customError.js';
import { appConfigRepo } from "../repositories/appConfigRepo.js";




export function appConfigHandlers() {

    ipcMain.handle("getAppConfig", async (): Promise<ResponseElectronGeneric> => {

        try {
            const configApp = await appConfigRepo.getConfig();
            if (!configApp) return { ok: false, data: null, error: { message: "No se obtuvo información", detail: "No hay app config" } }
            return { ok: true, error: null, data: configApp }
        } catch (error) {
            console.log(error);
            if (error instanceof AppError) {
                return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };
            }

            return { ok: false, data: null, error: { message: "Error interno no esperado", detail: "No fue posible obtener la configuración" } };
        }


    });

    ipcMain.handle("updateAppConfig", async (_e, fields: Partial<any>) => {
        try {
            await appConfigRepo.update(fields);
            return { ok: true, data: true, error: null };
        } catch (error) {
            return { ok: false, data: null, error: { message: "Error interno", detail: "No se pudo actualizar configuración" } };
        }
    }
    );




}
