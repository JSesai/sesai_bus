import { getDB } from "../connection.js";

const db = getDB();

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
    price
  }: TicketInsert): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (seatNumbers.length === 0) {
        return resolve(); // nada que insertar
      }

      // Construir placeholders dinámicos
      const placeholders = seatNumbers.map(() => "(?, ?, ?, ?, 'selectedTemporal')").join(", ");
      const sql = `
      INSERT INTO tickets (schedule_id, customer_id, seat_number, price, status)
      VALUES ${placeholders}
    `;

      // Flatten de parámetros
      const params: any[] = [];
      seatNumbers.forEach((seatNumber) => {
        params.push(scheduleId, customerId, seatNumber, price);
      });

      db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        db.run(sql, params, (err) => {
          if (err) {
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

  updateTicketStatus: (scheduleId: number, seatNumbers: SeatData['seat_number'][], newStatus: SeatData['status']): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (seatNumbers.length === 0) return resolve();

      const placeholders = seatNumbers.map(() => "?").join(", ");
      const sql = `
      UPDATE tickets
      SET status = ?
      WHERE schedule_id = ?
        AND seat_number IN (${placeholders})
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

  getReservationsByDate: async (date: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          c.name AS customer_name,
          c.phone AS customer_phone,
          s.id AS schedule_id,
          s.departure_time,
          s.route,
          GROUP_CONCAT(t.seat_number, ', ') AS seats,
          SUM(t.price) AS total_amount,
          t.status AS ticket_status,
          DATE(t.purchase_time) AS reservation_date
        FROM tickets t
        JOIN customers c ON t.customer_id = c.id
        JOIN schedules s ON t.schedule_id = s.id
        WHERE DATE(t.purchase_time) = DATE(?)
        GROUP BY c.name, c.phone, s.id, s.departure_time, s.route, t.status, reservation_date
        ORDER BY t.purchase_time ASC;
      `;

      db.all(sql, [date], (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }








};
