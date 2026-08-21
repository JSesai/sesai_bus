import { getDB } from "../connection.js";
import { handleCheckSession } from "../handlers/userHandlers.js";

const db = getDB();
let userLoged: UserResponseAuth | null = null;



export const ticketsRepo = {

  getAll: () =>
    new Promise((resolve, reject) => {
      db.all(`SELECT * FROM tickets`, (err, rows) =>
        err ? reject(err) : resolve(rows)
      );
    }),

  getById: (id: number) =>
    new Promise((resolve, reject) => {
      db.get(`SELECT * FROM tickets WHERE id = ?`, [id], (err, row) =>
        err ? reject(err) : resolve(row)
      );
    }),

  add: (ticket: {
    schedule_id: number;
    customer_id: number;
    seat_number: number;
    price: number;
  }) =>
    new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO tickets (schedule_id, customer_id, seat_number, price)
         VALUES (?, ?, ?, ?)`,
        [ticket.schedule_id, ticket.customer_id, ticket.seat_number, ticket.price],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...ticket });
        }
      );
    }),

  update: (ticket: {
    id: number;
    schedule_id?: number;
    customer_id?: number;
    seat_number?: number;
    price?: number;
  }) =>
    new Promise((resolve, reject) => {
      db.run(
        `UPDATE tickets SET
          schedule_id = COALESCE(?, schedule_id),
          customer_id = COALESCE(?, customer_id),
          seat_number = COALESCE(?, seat_number),
          price = COALESCE(?, price)
         WHERE id = ?`,
        [ticket.schedule_id, ticket.customer_id, ticket.seat_number, ticket.price, ticket.id],
        function (err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    }),

  delete: (id: number) =>
    new Promise((resolve, reject) => {
      db.run(`DELETE FROM tickets WHERE id = ?`, [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    }),

  insertSelectedSeats: ({
    scheduleId,
    customerId,
    seatNumbers,
    price,
    return_date
  }: TicketInsert, idUserLoged: number): Promise<void> => {



    return new Promise((resolve, reject) => {
      if (seatNumbers.length === 0) {
        return resolve(); // nada que insertar
      }

      // Construir placeholders dinámicos
      const placeholders = seatNumbers.map(() => "(?, ?, ?, ?, ?, ?, 'selectedTemporal')").join(", ");
      const sql = `
      INSERT INTO tickets (schedule_id, customer_id, seat_number, user_id, price, return_date,status)
      VALUES ${placeholders}
    `;

      // Flatten de parámetros
      const params: any[] = [];
      seatNumbers.forEach((seatNumber) => {
        params.push(scheduleId, customerId, seatNumber, idUserLoged, price, return_date);
      });

      db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        db.run(sql, params, (err) => {
          if (err) {
            console.log("Error en insert ticket:", err.message);
            db.run("ROLLBACK");
            if (err.message.includes("UNIQUE constraint failed")) {
              reject(new Error("Uno o más asientos ya fueron ocupados."));
            } else {
              reject(err);
            }
          } else {
            db.run("COMMIT", (commitErr) => {
              if (commitErr) {
                db.run("ROLLBACK");
                reject(commitErr);
              } else {
                resolve();
              }
            });
          }
        });
      });
    });
  },

  deletedTicketNotcomfirmed: (idUserLoged: number): Promise<void> => {

    return new Promise((resolve, reject) => {
      const sql = `
        DELETE FROM tickets
        WHERE purchase_id IS NULL
        AND status = 'selectedTemporal' 
        AND user_id = ?
      `;

      const params = [idUserLoged];
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  updateTicketStatus: (scheduleId: number, seatNumbers: SeatData['seat_number'][], newStatus: SeatData['status']): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (seatNumbers.length === 0) return resolve();

      const placeholders = seatNumbers.map(() => "?").join(", ");
      const sql = `
      UPDATE tickets
      SET status = ?
      WHERE schedule_id = ?
        AND seat_number IN (${placeholders})
        AND status != 'cancelled'
    `;

      const params = [newStatus, scheduleId, ...seatNumbers];
      db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        db.run(sql, params, (err) => {
          if (err) {
            db.run("ROLLBACK");
            reject(err);
          } else {
            db.run("COMMIT", (commitErr) => {
              if (commitErr) {
                db.run("ROLLBACK");
                reject(commitErr);
              } else {
                resolve();
              }
            });
          }
        });
      });

    });
  },

  reassignSeats: (
    scheduleId: number,
    customerId: number,
    oldSeatNumbers: number[],
    newSeatNumbers: number[]
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (oldSeatNumbers.length === 0 || newSeatNumbers.length === 0) {
        return reject(new Error("Se requieren asientos anteriores y nuevos para reasignar."));
      }
      if (oldSeatNumbers.length !== newSeatNumbers.length) {
        return reject(new Error("La cantidad de asientos anteriores y nuevos debe ser igual."));
      }

      const placeholders = newSeatNumbers.map(() => "?").join(", ");
      const checkSql = `
        SELECT DISTINCT seat_number FROM tickets
        WHERE schedule_id = ?
          AND seat_number IN (${placeholders})
          AND status NOT IN ('cancelled')
      `;

      db.get(checkSql, [scheduleId, ...newSeatNumbers], (err, row: any) => {
        if (err) {
          return reject(err);
        }
        if (row) {
          return reject(new Error(`El asiento ${row.seat_number} no está disponible.`));
        }

        // Ejecutar updates secuencialmente dentro de una transacción
        // (el índice único parcial permite mover el ticket sin borrar los históricos cancelados)
        const updateStmt = `
          UPDATE tickets
          SET seat_number = ?
          WHERE schedule_id = ?
            AND seat_number = ?
            AND customer_id = ?
            AND status IN ('reserved', 'occupied')
        `;

        const runUpdate = (index: number): void => {
          if (index >= oldSeatNumbers.length) {
            // Todos los updates completos, hacer commit
            db.run("COMMIT", (commitErr) => {
              if (commitErr) {
                db.run("ROLLBACK");
                return reject(commitErr);
              }
              resolve();
            });
            return;
          }

          db.run(updateStmt, [newSeatNumbers[index], scheduleId, oldSeatNumbers[index], customerId], function (updateErr) {
            if (updateErr) {
              db.run("ROLLBACK");
              return reject(updateErr);
            }
            if (this.changes === 0) {
              db.run("ROLLBACK");
              return reject(new Error(`No se encontró el asiento ${oldSeatNumbers[index]} para reasignar.`));
            }
            // Continuar con el siguiente update
            runUpdate(index + 1);
          });
        };

        // Iniciar transacción y comenzar updates
        db.run("BEGIN TRANSACTION", (txErr) => {
          if (txErr) {
            return reject(txErr);
          }
          runUpdate(0);
        });
      });
    });
  },

  getReservationsByDate: async (date: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          c.name AS customer_name,
          c.id AS customer_id,
          c.phone AS customer_phone,
          s.id AS schedule_id,
          s.departure_time,
          s.vehicle_number,
          r.origin,
          r.cityName,
          r.terminalName,
          r.baseFare AS base_fare,
          GROUP_CONCAT(t.seat_number, ', ') AS seats,
          SUM(t.price) AS total_amount,
          t.status AS ticket_status,
          t.return_date,
          DATE(s.dateDeparture) AS reservation_date
        FROM tickets t
        JOIN customers c ON t.customer_id = c.id
        JOIN schedules s ON t.schedule_id = s.id
        JOIN routes r ON s.route_id = r.id
        WHERE DATE(s.dateDeparture) = DATE(?)
        AND t.status IN ('reserved', 'cancelled', 'occupied')
        GROUP BY c.name, c.phone, s.id, s.departure_time, r.origin, r.cityName, r.terminalName, r.baseFare, t.status, reservation_date, t.return_date
        ORDER BY s.dateDeparture ASC;
      `;

      db.all(sql, [date], (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  },

  cancelReservation: (
    scheduleId: number,
    seatNumbers: number[],
    purchaseId: number | null,
    reason: string
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (seatNumbers.length === 0) {
        return reject(new Error("Se requieren asientos para cancelar."));
      }

      const placeholders = seatNumbers.map(() => "?").join(", ");

      db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        // 1. Actualizar tickets a cancelled con motivo
        const updateTicketsSql = `
          UPDATE tickets
          SET status = 'cancelled', cancel_reason = ?, cancelled_at = datetime('now', 'localtime')
          WHERE schedule_id = ?
            AND seat_number IN (${placeholders})
            AND status IN ('reserved', 'occupied')
        `;
        db.run(updateTicketsSql, [reason, scheduleId, ...seatNumbers], (err) => {
          if (err) {
            db.run("ROLLBACK");
            return reject(err);
          }

          // 2. Si tiene purchase, cancelar purchase y reembolsar pago
          if (purchaseId) {
            const updatePurchaseSql = `UPDATE purchases SET status = 'cancelled' WHERE id = ?`;
            db.run(updatePurchaseSql, [purchaseId], (errPurchase) => {
              if (errPurchase) {
                db.run("ROLLBACK");
                return reject(errPurchase);
              }

              const updatePaymentSql = `UPDATE payments SET status = 'refunded' WHERE purchase_id = ?`;
              db.run(updatePaymentSql, [purchaseId], (errPayment) => {
                if (errPayment) {
                  db.run("ROLLBACK");
                  return reject(errPayment);
                }

                db.run("COMMIT", (commitErr) => {
                  if (commitErr) {
                    db.run("ROLLBACK");
                    return reject(commitErr);
                  }
                  resolve();
                });
              });
            });
          } else {
            // Sin purchase, solo commit
            db.run("COMMIT", (commitErr) => {
              if (commitErr) {
                db.run("ROLLBACK");
                return reject(commitErr);
              }
              resolve();
            });
          }
        });
      });
    });
  },
};
