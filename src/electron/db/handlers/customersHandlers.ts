import { ipcMain } from "electron";
import { customersRepo } from "../repositories/customersRepo.js";

export function registerCustomersHandlers() {
  ipcMain.handle("getCustomers", () => customersRepo.getAll());
  ipcMain.handle("getCustomerById", (_, id: number) => customersRepo.getById(id));
  ipcMain.handle("addCustomer", (_, customer) => customersRepo.add(customer));
  ipcMain.handle("updateCustomer", (_, customer) => customersRepo.update(customer));
  ipcMain.handle("deleteCustomer", (_, id: number) => customersRepo.delete(id));
}
