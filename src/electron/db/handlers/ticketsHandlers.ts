import { ipcMain } from "electron";
import { ticketsRepo } from "../repositories/ticketsRepo.js";

export function registerTicketsHandlers() {
  ipcMain.handle("getTickets", () => ticketsRepo.getAll());
  ipcMain.handle("getTicketById", (_, id: number) => ticketsRepo.getById(id));
  ipcMain.handle("addTicket", (_, ticket) => ticketsRepo.add(ticket));
  ipcMain.handle("updateTicket", (_, ticket) => ticketsRepo.update(ticket));
  ipcMain.handle("deleteTicket", (_, id: number) => ticketsRepo.delete(id));


  ipcMain.handle("insertSelectedSeats", async (_, ticketInsert: TicketInsert): Promise<ResponseElectronGeneric> => {
    console.log("init process insertSelectedSeats", ticketInsert);

    try {
      const insertedTickets = await ticketsRepo.insertSelectedSeats(ticketInsert);
      return { ok: true, error: null, data: insertedTickets }
    } catch (error: any) {
      console.log('error al insertar asientos seleccionados ->', error);
      return { ok: false, data: null, error: { message: error.message || "Error interno", detail: "No fue posible procesar la compra de los asientos seleccionados" } };
    }

  });

}
