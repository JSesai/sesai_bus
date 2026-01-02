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
  update: (bus: Partial<Bus> & { id: number }) =>
    new Promise((resolve, reject) => {
      db.run(
        `
          UPDATE buses SET
            number           = COALESCE(?, number),
            seatingCapacity  = COALESCE(?, seatingCapacity),
            plate            = COALESCE(?, plate),
            serialNumber     = COALESCE(?, serialNumber),
            year             = COALESCE(?, year),
            model            = COALESCE(?, model),
            characteristics  = COALESCE(?, characteristics),
            status           = COALESCE(?, status)
          WHERE id = ?
          `,
        [
          bus.number,
          bus.seatingCapacity,
          bus.plate,
          bus.serialNumber,
          bus.year,
          bus.model,
          bus.characteristics ?? null,
          bus.status,
          bus.id
        ],
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
