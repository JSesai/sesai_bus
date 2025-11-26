import { ipcMain } from "electron";
import { ticketsRepo } from "../repositories/ticketsRepo.js";

export function registerTicketsHandlers() {
  ipcMain.handle("getTickets", () => ticketsRepo.getAll());
  ipcMain.handle("getTicketById", (_, id: number) => ticketsRepo.getById(id));
  ipcMain.handle("addTicket", (_, ticket) => ticketsRepo.add(ticket));
  ipcMain.handle("updateTicket", (_, ticket) => ticketsRepo.update(ticket));
  ipcMain.handle("deleteTicket", (_, id: number) => ticketsRepo.delete(id));
}
