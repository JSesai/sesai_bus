import { ipcMain } from "electron";
import { ticketsRepo } from "../repositories/ticketsRepo.js";
import { BusError, TicketError } from "../../../shared/errors/customError.js";
import { se } from "date-fns/locale";
import { userRepo } from "../repositories/userRepo.js";
import { handleCheckSession } from "./userHandlers.js";

export function registerTicketsHandlers() {

  let userLoged: UserResponseAuth | null = null;
  handleCheckSession().then(({ data }) => {
    if (data) {
      userLoged = data;
    }
  }).catch(error => {
    console.log('error al verificar sesión en tickets handlers', error);
  });


  ipcMain.handle("getTickets", () => ticketsRepo.getAll());
  ipcMain.handle("getTicketById", (_, id: number) => ticketsRepo.getById(id));
  ipcMain.handle("addTicket", (_, ticket) => ticketsRepo.add(ticket));
  ipcMain.handle("updateTicket", (_, ticket) => ticketsRepo.update(ticket));
  ipcMain.handle("deleteTicket", (_, id: number) => ticketsRepo.delete(id));


  ipcMain.handle("insertSelectedSeats", async (_, ticketInsert: TicketInsert): Promise<ResponseElectronGeneric> => {
    console.log("init process insertSelectedSeats", ticketInsert);

    try {
      // handleCheckSession().then(({ data }) => {
      //   if (data) {
      //     userLoged = data;
      //   }
      // });


      const insertedTickets = await ticketsRepo.insertSelectedSeats(ticketInsert, userLoged?.id || 0);
      return { ok: true, error: null, data: insertedTickets }
    } catch (error: any) {
      console.log('error al insertar asientos seleccionados ->', error);
      return { ok: false, data: null, error: { message: error.message || "Error interno", detail: "No fue posible procesar la compra de los asientos seleccionados" } };
    }

  });

  ipcMain.handle("updateTicketStatus", async (_, scheduleId: number, seatNumbers: SeatData['seat_number'][], newStatus: SeatData['status']) => {
    console.log("init process updateTicketStatus", 'scheduleId', scheduleId, 'setNumbers', seatNumbers, 'newStatus', newStatus);
    try {

      const updated = await ticketsRepo.updateTicketStatus(scheduleId, seatNumbers, newStatus);
      return { ok: true, error: null, data: updated }

    } catch (error: any) {
      console.log('error al actualizar el estado de los tickets ->', error);
      return { ok: false, data: null, error: { message: error.message || "Error interno", detail: "No fue posible actualizar el estado de los tickets" } };

    }


  });

  ipcMain.handle("deletedTicketNotcomfirmed", async (_, id) => {


    try {
      if (!id) {
        throw new TicketError("Id de usuario es requerido para eliminar tickets no confirmados")
      }

      const userLogged = await handleCheckSession();

      if (userLogged.error) {
        throw new TicketError(userLogged.error?.message, userLogged.error?.detail)
      }

      if (userLogged?.data?.id !== id) {
        throw new TicketError("No tienes permisos para eliminar estos tickets", "Solo puedes eliminar tus tickets no confirmados")
      }
      const deleted = await ticketsRepo.deletedTicketNotcomfirmed(userLoged?.id || 0);
      return { ok: true, error: null, data: deleted }

    } catch (error: any) {
      console.log('error al eliminar tickets no confirmados ->', error);
      return { ok: false, data: null, error: { message: error.message || "Error interno", detail: "No fue posible eliminar los tickets no confirmados" } };

    }

  });


  ipcMain.handle("getReservationsByDate", async (_, dateReservation: string) => {
    console.log("init process getReservationsByDate", dateReservation);
    try {
      const reservations = await ticketsRepo.getReservationsByDate(dateReservation);
      return { ok: true, error: null, data: reservations }

    } catch (error: any) {
      console.log('error al optener el estado de los tickets por fecha ->', error);
      return { ok: false, data: null, error: { message: error.message || "Error interno", detail: "No fue posible obtener reservaciones por fecha" } };

    }


  });


}
