import { getDB } from "../connection.js";

const db = getDB();

export const busesRepo = {
  getAll: () =>
    new Promise((resolve, reject) => {
      db.all("SELECT * FROM buses", (err, rows) => (err ? reject(err) : resolve(rows)));
    }),

  getById: (id: number) =>
    new Promise((resolve, reject) => {
      db.get("SELECT * FROM buses WHERE id = ?", [id], (err, row) =>
        err ? reject(err) : resolve(row)
      );
    }),

  add: (bus: Bus) =>
    new Promise((resolve, reject) => {
      db.run(
        `
          INSERT INTO buses (
            number,
            seatingCapacity,
            plate,
            serialNumber,
            year,
            model,
            characteristics
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
        [
          bus.number,
          bus.seatingCapacity,
          bus.plate,
          bus.serialNumber,
          bus.year,
          bus.model,
          bus.characteristics ?? null
        ],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...bus });
        }
      );
    }),


  update: (bus: { id: number; number?: string; capacity?: number }) =>
    new Promise((resolve, reject) => {
      db.run(
        "UPDATE buses SET number = COALESCE(?, number), capacity = COALESCE(?, capacity) WHERE id = ?",
        [bus.number, bus.capacity, bus.id],
        function (err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    }),

  delete: (id: number) =>
    new Promise((resolve, reject) => {
      db.run("DELETE FROM buses WHERE id = ?", [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    }),
};
