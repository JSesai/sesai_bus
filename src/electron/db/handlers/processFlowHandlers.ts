import { ipcMain } from "electron";
import { processFlowRepo } from "../repositories/processFlowRepo.js";
import { logger } from "../../service/logger.js";

export function registerProcessFlowHandlers() {

    ipcMain.handle("processConfirmedPurchase", async (_, props: IProcessConfirmedPurchase): Promise<ResponseElectronGeneric> => {
        console.log("Handler processConfirmedPurchase called", props);

        try {

            const response = await processFlowRepo.processConfirmedPurchase(props);
            return { ok: true, data: response, error: null };

        } catch (error) {
            logger.error('processFlowHandlers', 'Error', error);
            //   if (error instanceof DestinationRouteError) {
            //     return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };
            //   }

            return { ok: false, data: null, error: { message: "Error interno no esperado", detail: "No fue posible obtener confirmar el proceso de confirmación de compra" } };
        }


    });



}
