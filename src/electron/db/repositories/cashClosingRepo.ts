import { getDB } from "../connection.js";

const db = getDB();

export const cashClosingRepo = {

    openCashClosing: (userId: number, agencyId: number): Promise<any> => {
        return new Promise((resolve, reject) => {
            const now = new Date();
            const closingDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            const openingTime = now.toTimeString().slice(0, 5);

            db.run(
                `INSERT INTO cash_closings (agency_id, user_id, closing_date, opening_time, status)
                 VALUES (?, ?, ?, ?, 'open')`,
                [agencyId, userId, closingDate, openingTime],
                function (err) {
                    if (err) return reject(err);
                    db.get(
                        `SELECT * FROM cash_closings WHERE id = ?`,
                        [this.lastID],
                        (err, row) => {
                            if (err) return reject(err);
                            resolve(row);
                        }
                    );
                }
            );
        });
    },

    getActiveCashClosing: (agencyId: number): Promise<any> => {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM cash_closings WHERE agency_id = ? AND status = 'open' ORDER BY id DESC LIMIT 1`,
                [agencyId],
                (err, row) => {
                    if (err) return reject(err);
                    resolve(row || null);
                }
            );
        });
    },

    getCashClosingSummary: (agencyId: number, date: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT
                    p.method,
                    COUNT(DISTINCT pu.id) as purchase_count,
                    COALESCE(SUM(p.amount), 0) as total_amount
                FROM payments p
                JOIN purchases pu ON p.purchase_id = pu.id
                WHERE DATE(p.created_at, 'localtime') = DATE(?)
                  AND p.status = 'confirmed'
                  AND pu.status = 'confirmed'
                  AND pu.id IN (
                      SELECT DISTINCT t.purchase_id
                      FROM tickets t
                      JOIN schedules s ON t.schedule_id = s.id
                      WHERE s.agency_id = ?
                  )
                GROUP BY p.method
            `;
            db.all(sql, [date, agencyId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows || []);
            });
        });
    },

    getCashClosingPeriodSummary: (agencyId: number, fromDate: string, toDate: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const byMethodSql = `
                SELECT
                    p.method,
                    COUNT(DISTINCT pu.id) as purchase_count,
                    COALESCE(SUM(p.amount), 0) as total_amount
                FROM payments p
                JOIN purchases pu ON p.purchase_id = pu.id
                WHERE DATE(p.created_at, 'localtime') BETWEEN DATE(?) AND DATE(?)
                  AND p.status = 'confirmed'
                  AND pu.status = 'confirmed'
                  AND pu.id IN (
                      SELECT DISTINCT t.purchase_id
                      FROM tickets t
                      JOIN schedules s ON t.schedule_id = s.id
                      WHERE s.agency_id = ?
                  )
                GROUP BY p.method
            `;
            const cancelledSql = `
                SELECT
                    COUNT(DISTINCT t.id) as cancel_count,
                    COALESCE(SUM(t.price), 0) as cancel_amount
                FROM tickets t
                JOIN schedules s ON t.schedule_id = s.id
                WHERE DATE(t.cancelled_at, 'localtime') BETWEEN DATE(?) AND DATE(?)
                  AND s.agency_id = ?
                  AND t.status = 'cancelled'
            `;
            const reservedSql = `
                SELECT
                    COUNT(DISTINCT t.id) as reservation_count,
                    COALESCE(SUM(t.price), 0) as reservation_amount
                FROM tickets t
                JOIN schedules s ON t.schedule_id = s.id
                WHERE DATE(t.created_at, 'localtime') BETWEEN DATE(?) AND DATE(?)
                  AND s.agency_id = ?
                  AND t.status = 'reserved'
            `;

            db.all(byMethodSql, [fromDate, toDate, agencyId], (errByMethod, byMethod) => {
                if (errByMethod) return reject(errByMethod);
                db.all(cancelledSql, [fromDate, toDate, agencyId], (errCancelled, cancellations) => {
                    if (errCancelled) return reject(errCancelled);
                    db.all(reservedSql, [fromDate, toDate, agencyId], (errReserved, reservations) => {
                        if (errReserved) return reject(errReserved);

                        const totalSales = (byMethod || []).reduce((acc: number, r: any) => acc + r.total_amount, 0);
                        const transactionCount = (byMethod || []).reduce((acc: number, r: any) => acc + r.purchase_count, 0);
                        const totalCancelledAmount = (cancellations || []).reduce((acc: number, r: any) => acc + r.cancel_amount, 0);
                        const cancelledCount = (cancellations || []).reduce((acc: number, r: any) => acc + r.cancel_count, 0);
                        const totalReservationAmount = (reservations || []).reduce((acc: number, r: any) => acc + r.reservation_amount, 0);
                        const reservationCount = (reservations || []).reduce((acc: number, r: any) => acc + r.reservation_count, 0);

                        const summary = {
                            byMethod: byMethod || [],
                            totalSales,
                            totalReservations: totalReservationAmount,
                            reservationCount,
                            totalCancellations: totalCancelledAmount,
                            cancelledCount,
                            totalServiceFees: 0,
                            transactionCount,
                        };

                        resolve(summary);
                    });
                });
            });
        });
    },

    getCashClosingById: (closingId: number): Promise<any> => {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM cash_closings WHERE id = ?`,
                [closingId],
                (err, row) => {
                    if (err) return reject(err);
                    resolve(row || null);
                }
            );
        });
    },

    getCancelledSummary: (agencyId: number, date: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT
                    COUNT(DISTINCT t.id) as cancel_count,
                    COALESCE(SUM(t.price), 0) as cancel_amount
                FROM tickets t
                JOIN schedules s ON t.schedule_id = s.id
                WHERE DATE(t.cancelled_at, 'localtime') = DATE(?)
                  AND s.agency_id = ?
                  AND t.status = 'cancelled'
            `;
            db.all(sql, [date, agencyId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows || []);
            });
        });
    },

    getReservationSummary: (agencyId: number, date: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT
                    COUNT(DISTINCT t.id) as reservation_count,
                    COALESCE(SUM(t.price), 0) as reservation_amount
                FROM tickets t
                JOIN schedules s ON t.schedule_id = s.id
                WHERE DATE(t.created_at, 'localtime') = DATE(?)
                  AND s.agency_id = ?
                  AND t.status = 'reserved'
            `;
            db.all(sql, [date, agencyId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows || []);
            });
        });
    },

    getCashClosingTransactions: (agencyId: number, date: string): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT
                    t.id,
                    c.name as customer_name,
                    c.phone as customer_phone,
                    r.origin,
                    r.cityName as destination,
                    s.departure_time,
                    s.dateDeparture as date_departure,
                    GROUP_CONCAT(t.seat_number) as seat_numbers,
                    COUNT(t.id) as ticket_count,
                    pu.total_amount as amount,
                    p.method,
                    p.status as payment_status,
                    pu.status as purchase_status,
                    p.created_at
                FROM payments p
                JOIN purchases pu ON p.purchase_id = pu.id
                JOIN tickets t ON t.purchase_id = pu.id
                JOIN customers c ON t.customer_id = c.id
                JOIN schedules s ON t.schedule_id = s.id
                JOIN routes r ON s.route_id = r.id
                WHERE DATE(p.created_at, 'localtime') = DATE(?)
                  AND s.agency_id = ?
                  AND p.status = 'confirmed'
                  AND pu.status = 'confirmed'
                GROUP BY pu.id
                ORDER BY p.created_at DESC
            `;
            db.all(sql, [date, agencyId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows || []);
            });
        });
    },

    closeCashClosing: (closingId: number, totals: {
        total_cash: number;
        total_card: number;
        total_transfer: number;
        total_sales: number;
        total_reservations: number;
        total_cancellations: number;
        total_service_fees: number;
        transaction_count: number;
        notes?: string;
    }): Promise<void> => {
        return new Promise((resolve, reject) => {
            const closingTime = new Date().toTimeString().slice(0, 5);
            db.run(
                `UPDATE cash_closings
                 SET status = 'closed',
                     closing_time = ?,
                     total_cash = ?,
                     total_card = ?,
                     total_transfer = ?,
                     total_sales = ?,
                     total_reservations = ?,
                     total_cancellations = ?,
                     total_service_fees = ?,
                     transaction_count = ?,
                     notes = ?
                 WHERE id = ?`,
                [
                    closingTime,
                    totals.total_cash,
                    totals.total_card,
                    totals.total_transfer,
                    totals.total_sales,
                    totals.total_reservations,
                    totals.total_cancellations,
                    totals.total_service_fees,
                    totals.transaction_count,
                    totals.notes || null,
                    closingId
                ],
                (err) => {
                    if (err) return reject(err);
                    resolve();
                }
            );
        });
    },

    getCashClosingHistory: (agencyId: number): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT cc.*, u.name as user_name
                 FROM cash_closings cc
                 JOIN users u ON cc.user_id = u.id
                 WHERE cc.agency_id = ? AND cc.status = 'closed'
                 ORDER BY cc.closing_date DESC, cc.closing_time DESC`,
                [agencyId],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []);
                }
            );
        });
    },

};
