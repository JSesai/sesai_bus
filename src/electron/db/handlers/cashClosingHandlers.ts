import { ipcMain } from "electron";
import { cashClosingRepo } from "../repositories/cashClosingRepo.js";
import { logger } from "../../service/logger.js";

const todayLocal = (): string => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export function registerCashClosingHandlers() {

    ipcMain.handle("openCashClosing", async (_, userId: number, agencyId: number) => {
        try {
            const closing = await cashClosingRepo.openCashClosing(userId, agencyId);
            return { ok: true, data: closing, error: null };
        } catch (error) {
            logger.error('cashClosingHandlers', 'Error', error);
            return { ok: false, data: null, error: { message: "Error al abrir corte de caja", detail: String(error) } };
        }
    });

    ipcMain.handle("getActiveCashClosing", async (_, agencyId: number) => {
        try {
            const closing = await cashClosingRepo.getActiveCashClosing(agencyId);
            return { ok: true, data: closing, error: null };
        } catch (error) {
            logger.error('cashClosingHandlers', 'Error', error);
            return { ok: false, data: null, error: { message: "Error al obtener corte activo", detail: String(error) } };
        }
    });

    ipcMain.handle("getCashClosingSummary", async (_, agencyId: number, date: string) => {
        try {
            const byMethod = await cashClosingRepo.getCashClosingSummary(agencyId, date);
            const cancellations = await cashClosingRepo.getCancelledSummary(agencyId, date);
            const reservations = await cashClosingRepo.getReservationSummary(agencyId, date);

            const totalSales = byMethod.reduce((acc: number, r: any) => acc + r.total_amount, 0);
            const transactionCount = byMethod.reduce((acc: number, r: any) => acc + r.purchase_count, 0);
            const totalCancelledAmount = cancellations.reduce((acc: number, r: any) => acc + r.cancel_amount, 0);
            const cancelledCount = cancellations.reduce((acc: number, r: any) => acc + r.cancel_count, 0);
            const totalReservationAmount = reservations.reduce((acc: number, r: any) => acc + r.reservation_amount, 0);
            const reservationCount = reservations.reduce((acc: number, r: any) => acc + r.reservation_count, 0);

            const summary = {
                byMethod,
                totalSales,
                totalReservations: totalReservationAmount,
                reservationCount,
                totalCancellations: totalCancelledAmount,
                cancelledCount,
                totalServiceFees: 0,
                transactionCount,
            };

            return { ok: true, data: summary, error: null };
        } catch (error) {
            logger.error('cashClosingHandlers', 'Error', error);
            return { ok: false, data: null, error: { message: "Error al obtener resumen", detail: String(error) } };
        }
    });

    ipcMain.handle("getCashClosingPeriodSummary", async (_, agencyId: number, fromDate: string, toDate: string) => {
        try {
            const summary = await cashClosingRepo.getCashClosingPeriodSummary(agencyId, fromDate, toDate);
            return { ok: true, data: summary, error: null };
        } catch (error) {
            logger.error('cashClosingHandlers', 'Error', error);
            return { ok: false, data: null, error: { message: "Error al obtener resumen del período", detail: String(error) } };
        }
    });

    ipcMain.handle("getCashClosingTransactions", async (_, agencyId: number, date: string) => {
        try {
            const transactions = await cashClosingRepo.getCashClosingTransactions(agencyId, date);
            return { ok: true, data: transactions, error: null };
        } catch (error) {
            logger.error('cashClosingHandlers', 'Error', error);
            return { ok: false, data: null, error: { message: "Error al obtener transacciones", detail: String(error) } };
        }
    });

    ipcMain.handle("closeCashClosing", async (_, closingId: number, notes: string) => {
        try {
            const closing = await cashClosingRepo.getCashClosingById(closingId);
            if (!closing) {
                return { ok: false, data: null, error: { message: "Corte de caja no encontrado", detail: String(closingId) } };
            }

            const summary = await cashClosingRepo.getCashClosingPeriodSummary(
                closing.agency_id,
                closing.closing_date,
                todayLocal()
            );

            const totals = {
                total_cash: summary.byMethod.find((m: any) => m.method === 'cash')?.total_amount || 0,
                total_card: summary.byMethod.find((m: any) => m.method === 'card')?.total_amount || 0,
                total_transfer: summary.byMethod.find((m: any) => m.method === 'transfer')?.total_amount || 0,
                total_sales: summary.totalSales,
                total_reservations: summary.totalReservations,
                total_cancellations: summary.totalCancellations,
                total_service_fees: summary.totalServiceFees,
                transaction_count: summary.transactionCount,
                notes: notes?.trim() ? notes : undefined,
            };

            await cashClosingRepo.closeCashClosing(closingId, totals);
            return { ok: true, data: null, error: null };
        } catch (error) {
            logger.error('cashClosingHandlers', 'Error', error);
            return { ok: false, data: null, error: { message: "Error al cerrar corte de caja", detail: String(error) } };
        }
    });

    ipcMain.handle("getCashClosingHistory", async (_, agencyId: number) => {
        try {
            const history = await cashClosingRepo.getCashClosingHistory(agencyId);
            return { ok: true, data: history, error: null };
        } catch (error) {
            logger.error('cashClosingHandlers', 'Error', error);
            return { ok: false, data: null, error: { message: "Error al obtener historial", detail: String(error) } };
        }
    });

}
