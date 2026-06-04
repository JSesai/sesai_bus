import { ipcMain } from "electron";
import { processFlowRepo } from "../repositories/processFlowRepo.js";
import { ticketsRepo } from "../repositories/ticketsRepo.js";

export function registerProcessFlowHandlers() {

    ipcMain.handle("processConfirmedPurchase", async (_, props: IProcessConfirmedPurchase): Promise<ResponseElectronGeneric> => {
        console.log("Handler processConfirmedPurchase called", props);

        try {

            const response = await processFlowRepo.processConfirmedPurchase(props);
            return { ok: true, data: response, error: null };

        } catch (error) {
            console.log(error);
            //   if (error instanceof DestinationRouteError) {
            //     return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };
            //   }

            return { ok: false, data: null, error: { message: "Error interno no esperado", detail: "No fue posible obtener confirmar el proceso de confirmación de compra" } };
        }


    });



}
