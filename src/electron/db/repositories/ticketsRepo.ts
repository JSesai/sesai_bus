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
};
