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

  // insertSelectedSeats: ({ customerId, price, scheduleId, seatNumbers }: TicketInsert): Promise<void> => {
  //   return new Promise((resolve, reject) => {
  //     db.serialize(() => {
  //       db.run("BEGIN TRANSACTION");

  //       seatNumbers.forEach((seatNumber) => {
  //         db.run(
  //           `
  //             INSERT INTO tickets (schedule_id, customer_id, seat_number, price, status)
  //             VALUES (?, ?, ?, ?, 'selectedTemporal')
  //             `,
  //           [scheduleId, customerId, seatNumber, price],
  //           (err) => {
  //             if (err) {
  //               if (err.message.includes("UNIQUE constraint failed")) {
  //                 reject(new Error(`El asiento ${seatNumber} ya fue ocupado.`));
  //               } else {
  //                 reject(err);
  //               }
  //             }
  //           }
  //         );
  //       });

  //       db.run("COMMIT", (err) => {
  //         if (err) reject(err);
  //         else resolve();
  //       });
  //     });
  //   });
  // },


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
  }



};
