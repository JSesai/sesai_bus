import { ipcMain } from "electron";
import { boardingRepo } from "../repositories/boardingRepo.js";
import { getBoardingPin, regenerateBoardingPin } from "../../service/boarding/boardingConfig.js";
import { getBoardingServerInfo } from "../../service/boarding/boardingServer.js";
import { logger } from "../../service/logger.js";
import { BoardingError } from "../../../shared/errors/customError.js";

export function registerBoardingHandlers() {
  ipcMain.handle("boarding:getPin", async (): Promise<ResponseElectronGeneric> => {
    try {
      const pin = await getBoardingPin();
      return { ok: true, data: { pin }, error: null };
    } catch (error) {
      logger.error('boardingHandlers', "Error en boarding:getPin", error);
      return { ok: false, data: null, error: { message: "No fue posible obtener el PIN", detail: String(error) } };
    }
  });

  ipcMain.handle("boarding:regeneratePin", async (): Promise<ResponseElectronGeneric> => {
    try {
      const pin = await regenerateBoardingPin();
      return { ok: true, data: { pin }, error: null };
    } catch (error) {
      logger.error('boardingHandlers', "Error en boarding:regeneratePin", error);
      return { ok: false, data: null, error: { message: "No fue posible regenerar el PIN", detail: String(error) } };
    }
  });

  ipcMain.handle("boarding:getServerUrl", async (): Promise<ResponseElectronGeneric> => {
    try {
      const info = getBoardingServerInfo();
      return { ok: true, data: info, error: null };
    } catch (error) {
      logger.error('boardingHandlers', "Error en boarding:getServerUrl", error);
      return { ok: false, data: null, error: { message: "No fue posible obtener la URL", detail: String(error) } };
    }
  });

  ipcMain.handle("boarding:getDeparturesByDate", async (_event, date: string): Promise<ResponseElectronGeneric> => {
    try {
      const data = await boardingRepo.getDeparturesByDate(date);
      return { ok: true, data, error: null };
    } catch (error) {
      logger.error('boardingHandlers', "Error en boarding:getDeparturesByDate", error);
      return { ok: false, data: null, error: { message: "No fue posible obtener las salidas", detail: String(error) } };
    }
  });

  ipcMain.handle("boarding:getBoardingManifest", async (_event, scheduleId: number): Promise<ResponseElectronGeneric> => {
    try {
      const data = await boardingRepo.getBoardingManifest(scheduleId);
      return { ok: true, data, error: null };
    } catch (error) {
      logger.error('boardingHandlers', "Error en boarding:getBoardingManifest", error);
      return { ok: false, data: null, error: { message: "No fue posible obtener el manifiesto de abordaje", detail: String(error) } };
    }
  });

  ipcMain.handle("boarding:getTicketsByIds", async (_event, ticketIds: number[]): Promise<ResponseElectronGeneric> => {
    try {
      const data = await boardingRepo.getTicketsByIds(ticketIds);
      return { ok: true, data, error: null };
    } catch (error) {
      logger.error('boardingHandlers', "Error en boarding:getTicketsByIds", error);
      return { ok: false, data: null, error: { message: "No fue posible identificar el boleto", detail: String(error) } };
    }
  });

  ipcMain.handle("boarding:markBoarded", async (_event, ticketIds: number[], userId: number): Promise<ResponseElectronGeneric> => {
    try {
      const changes = await boardingRepo.markBoarded(ticketIds, userId);
      return { ok: true, data: { changes }, error: null };
    } catch (error) {
      if (error instanceof BoardingError) {
        logger.warn('boardingHandlers', "Abordaje rechazado", error.details);
        return { ok: false, data: null, error: { message: error.message, detail: error.details || error.message } };
      }
      logger.error('boardingHandlers', "Error en boarding:markBoarded", error);
      return { ok: false, data: null, error: { message: "No fue posible registrar el abordaje", detail: String(error) } };
    }
  });

  ipcMain.handle("boarding:unmarkBoarded", async (_event, ticketIds: number[]): Promise<ResponseElectronGeneric> => {
    try {
      const changes = await boardingRepo.unmarkBoarded(ticketIds);
      return { ok: true, data: { changes }, error: null };
    } catch (error) {
      logger.error('boardingHandlers', "Error en boarding:unmarkBoarded", error);
      return { ok: false, data: null, error: { message: "No fue posible revertir el abordaje", detail: String(error) } };
    }
  });
}
