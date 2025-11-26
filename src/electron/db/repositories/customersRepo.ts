import { getDB } from "../connection.js";

const db = getDB();

export const customersRepo = {
  getAll: () =>
    new Promise((resolve, reject) => {
      db.all(`SELECT * FROM customers`, (err, rows) =>
        err ? reject(err) : resolve(rows)
      );
    }),

  getById: (id: number) =>
    new Promise((resolve, reject) => {
      db.get(`SELECT * FROM customers WHERE id = ?`, [id], (err, row) =>
        err ? reject(err) : resolve(row)
      );
    }),

  add: (customer: {
    name: string;
    email?: string;
    phone: string;
  }) =>
    new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)`,
        [customer.name, customer.email, customer.phone],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...customer });
        }
      );
    }),

  update: (customer: {
    id: number;
    name?: string;
    email?: string;
    phone?: string;
  }) =>
    new Promise((resolve, reject) => {
      db.run(
        `UPDATE customers SET
          name = COALESCE(?, name),
          email = COALESCE(?, email),
          phone = COALESCE(?, phone)
         WHERE id = ?`,
        [customer.name, customer.email, customer.phone, customer.id],
        function (err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    }),

  delete: (id: number) =>
    new Promise((resolve, reject) => {
      db.run(`DELETE FROM customers WHERE id = ?`, [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    }),
};
