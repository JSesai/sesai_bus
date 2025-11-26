import { ipcMain } from "electron";
import { paymentsRepo } from "../repositories/paymentsRepo.js";

export function registerPaymentsHandlers() {
  ipcMain.handle("getPayments", () => paymentsRepo.getAll());
  ipcMain.handle("getPaymentById", (_, id: number) => paymentsRepo.getById(id));
  ipcMain.handle("addPayment", (_, payment) => paymentsRepo.add(payment));
  ipcMain.handle("updatePayment", (_, payment) => paymentsRepo.update(payment));
  ipcMain.handle("deletePayment", (_, id: number) => paymentsRepo.delete(id));
}
