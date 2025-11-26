import { getDB } from "../connection.js";

const db = getDB();

export const driversRepo = {
  getAll: () =>
    new Promise((resolve, reject) => {
      db.all("SELECT * FROM drivers", (err, rows) => (err ? reject(err) : resolve(rows)));
    }),

  getById: (id: number) =>
    new Promise((resolve, reject) => {
      db.get("SELECT * FROM drivers WHERE id = ?", [id], (err, row) =>
        err ? reject(err) : resolve(row)
      );
    }),

  add: (driver: { name: string; license_number: string }) =>
    new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO drivers (name, license_number) VALUES (?, ?)",
        [driver.name, driver.license_number],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...driver });
        }
      );
    }),

  update: (driver: { id: number; name?: string; license_number?: string }) =>
    new Promise((resolve, reject) => {
      db.run(
        "UPDATE drivers SET name = COALESCE(?, name), license_number = COALESCE(?, license_number) WHERE id = ?",
        [driver.name, driver.license_number, driver.id],
        function (err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    }),

  delete: (id: number) =>
    new Promise((resolve, reject) => {
      db.run("DELETE FROM drivers WHERE id = ?", [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    }),
};
