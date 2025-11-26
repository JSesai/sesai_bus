import { getDB } from "../connection.js";

const db = getDB();

export const paymentsRepo = {
  getAll: () =>
    new Promise((resolve, reject) => {
      db.all(`SELECT * FROM payments`, (err, rows) =>
        err ? reject(err) : resolve(rows)
      );
    }),

  getById: (id: number) =>
    new Promise((resolve, reject) => {
      db.get(`SELECT * FROM payments WHERE id = ?`, [id], (err, row) =>
        err ? reject(err) : resolve(row)
      );
    }),

  add: (payment: { ticket_id: number; method: string; amount: number }) =>
    new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO payments (ticket_id, method, amount)
         VALUES (?, ?, ?)`,
        [payment.ticket_id, payment.method, payment.amount],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...payment });
        }
      );
    }),

  update: (payment: {
    id: number;
    ticket_id?: number;
    method?: string;
    amount?: number;
  }) =>
    new Promise((resolve, reject) => {
      db.run(
        `UPDATE payments SET
          ticket_id = COALESCE(?, ticket_id),
          method = COALESCE(?, method),
          amount = COALESCE(?, amount)
         WHERE id = ?`,
        [payment.ticket_id, payment.method, payment.amount, payment.id],
        function (err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    }),

  delete: (id: number) =>
    new Promise((resolve, reject) => {
      db.run(`DELETE FROM payments WHERE id = ?`, [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    }),
};
