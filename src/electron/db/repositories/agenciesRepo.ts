import { getDB } from "../connection.js";

const db = getDB();

export const agenciesRepo = {
  getAll: () =>
    new Promise((resolve, reject) => {
      db.all("SELECT * FROM agencies", (err, rows) => (err ? reject(err) : resolve(rows)));
    }),

  getById: (id: number) =>
    new Promise((resolve, reject) => {
      db.get("SELECT * FROM agencies WHERE id = ?", [id], (err, row) =>
        err ? reject(err) : resolve(row)
      );
    }),

  add: (agency: { name: string; address?: string; phone?: string }) =>
    new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO agencies (name, address, phone) VALUES (?, ?, ?)",
        [agency.name, agency.address, agency.phone],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...agency });
        }
      );
    }),

  update: (agency: { id: number; name?: string; address?: string; phone?: string }) =>
    new Promise((resolve, reject) => {
      db.run(
        "UPDATE agencies SET name = COALESCE(?, name), address = COALESCE(?, address), phone = COALESCE(?, phone) WHERE id = ?",
        [agency.name, agency.address, agency.phone, agency.id],
        function (err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    }),

  delete: (id: number) =>
    new Promise((resolve, reject) => {
      db.run("DELETE FROM agencies WHERE id = ?", [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    }),
};
