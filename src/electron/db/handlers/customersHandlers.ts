import { ipcMain } from "electron";
import { customersRepo } from "../repositories/customersRepo.js";

export function registerCustomersHandlers() {
  ipcMain.handle("getCustomers", () => customersRepo.getAll());
  ipcMain.handle("getCustomerById", async (_, id: number) => {

    return customersRepo.getById(id)

  });
  ipcMain.handle("addCustomer", async (_, customer): Promise<ResponseElectronGeneric> => {
    try {
      const addedCustomer = await customersRepo.add(customer);
      if (!addedCustomer) return { ok: false, data: null, error: { message: "Error al agregar cliente", detail: "No fue posible agregar el cliente con la información proporcionada" } };

      return { ok: true, error: null, data: addedCustomer }
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        return { ok: false, data: null, error: { message: "Número de teléfono ya registrado", detail: "El número de teléfono proporcionado ya está asociado a otro cliente" } };
      }

      console.log('error al agregar cliente ->', error);
      return { ok: false, data: null, error: { message: "Error interno", detail: "No fue posible agregar el cliente con la información proporcionada" } };

    }

  });
  ipcMain.handle("updateCustomer", async (_, customer): Promise<ResponseElectronGeneric> => {

    try {
      const updatedCustomer = await customersRepo.update(customer);
      if (!updatedCustomer) return { ok: false, data: null, error: { message: "Error al actualizar cliente", detail: "No fue posible actualizar el cliente con la información proporcionada" } };

      return { ok: true, error: null, data: updatedCustomer }
    } catch (error: any) {

      if (error.code === 'SQLITE_CONSTRAINT') {
        return { ok: false, data: null, error: { message: "Número de teléfono ya registrado", detail: "El número de teléfono proporcionado ya está asociado a otro cliente" } };
      }

      console.log('error al actualizar cliente ->', error);
      return { ok: false, data: null, error: { message: "Error interno", detail: "No fue posible actualizar el cliente con la información proporcionada" } };

    }


  });
  ipcMain.handle("deleteCustomer", (_, id: number) => customersRepo.delete(id));

  ipcMain.handle("getCustomerByPhone", async (_e, phone: Customer['phone']): Promise<ResponseElectronGeneric> => {
    try {
      console.log("init process getCustomerByPhone", phone);
      const response = await customersRepo.getByPhone(phone);
      if (!response) return { ok: false, data: null, error: { message: "Cliente no encontrado", detail: "No existe un cliente registrado con el número de teléfono proporcionado" } };
      return { ok: true, error: null, data: response }

    } catch (error: any) {
      console.log('error al obtener phone ->', error);
      return { ok: false, data: null, error: { message: "Error interno", detail: "No fue posible obtener información del cliente" } };

    }

  });
  ipcMain.handle("createOrUpdateCustomer", async (_e, customer: Customer): Promise<ResponseElectronGeneric> => {
    try {
      console.log("init process createOrUpdateCustomer", customer);

      const existingCustomer = await customersRepo.getByPhone(customer.phone);

      if (!existingCustomer) {
        const addedCustomer = await customersRepo.add(customer);
        if (!addedCustomer) return { ok: false, data: null, error: { message: "Error al agregar cliente", detail: "No fue posible agregar el cliente con la información proporcionada" } };
        return { ok: true, error: null, data: addedCustomer }
      }

      const updatedCustomer = await customersRepo.update({ ...customer, id: existingCustomer.id });
      if (!updatedCustomer) return { ok: false, data: null, error: { message: "Error al actualizar cliente", detail: "No fue posible actualizar el cliente con la información proporcionada" } };
      return { ok: true, error: null, data: updatedCustomer }
    } catch (error: any) {
      console.log('error al obtener phone ->', error);

      return { ok: false, data: null, error: { message: "Error interno", detail: "No fue posible obtener información del cliente" } };

    }

  });

}
