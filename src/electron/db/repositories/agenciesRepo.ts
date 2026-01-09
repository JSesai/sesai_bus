import { getDB } from "../connection.js";

const db = getDB();

export const agenciesRepo = {
  getAgency: () =>
    new Promise((resolve, reject) => {
      db.get("SELECT * FROM agencies", (err, rows) => (err ? reject(err) : resolve(rows)));
    }),

  getById: (id: number) =>
    new Promise((resolve, reject) => {
      db.get("SELECT * FROM agencies WHERE id = ?", [id], (err, row) =>
        err ? reject(err) : resolve(row)
      );
    }),

  add: (agency: Agency) =>
    new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO agencies (name, location, phone) VALUES (?, ?, ?)",
        [agency.name, agency.location, agency.phone],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...agency });
        }
      );
    }),

  update: (agency: Agency) =>
    new Promise((resolve, reject) => {
      db.run(
        "UPDATE agencies SET name = COALESCE(?, name), location = COALESCE(?, location), phone = COALESCE(?, phone) WHERE id = ?",
        [agency.name, agency.location, agency.phone, agency.id],
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
