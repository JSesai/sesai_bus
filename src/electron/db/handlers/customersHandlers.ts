import { ipcMain } from "electron";
import { customersRepo } from "../repositories/customersRepo.js";

export function registerCustomersHandlers() {
  ipcMain.handle("getCustomers", () => customersRepo.getAll());
  ipcMain.handle("getCustomerById", (_, id: number) => customersRepo.getById(id));
  ipcMain.handle("addCustomer", (_, customer) => customersRepo.add(customer));
  ipcMain.handle("updateCustomer", (_, customer) => customersRepo.update(customer));
  ipcMain.handle("deleteCustomer", (_, id: number) => customersRepo.delete(id));

  ipcMain.handle("getCustomerByPhone", async (_e, phone: Customer['phone']): Promise<ResponseElectronGeneric> => {
    try {
      console.log("init process getCustomerByPhone", phone);
      const response = await customersRepo.getByPhone(phone);
      return { ok: true, error: null, data: response }

    } catch (error: any) {
      console.log('error al obtener phone ->', error);
      return { ok: false, data: null, error: { message: "Error interno", detail: "No fue posible obtener información del cliente" } };

    }

  });

}
