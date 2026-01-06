import { getDB } from "../connection.js";


interface DailyBusAssignment {
  busId: number
  model: string
  plate: string
  seatingCapacity: number
  busStatus: string
  dailyNumber: number | null
  assignmentStatus: string | null
}

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
            seatingCapacity,
            plate,
            serialNumber,
            year,
            model,
            characteristics
          ) VALUES (?, ?, ?, ?, ?, ?)
          `,
        [
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

  getDailyAssignments: (terminalId: number, date: string) =>
    new Promise((resolve, reject) => {
      db.all(
        `
          SELECT
            b.id AS bus_id,
            b.model,
            b.plate,
            b.seatingCapacity,
            b.status AS busStatus,
  
            a.daily_number AS dailyNumber,
            a.status AS assignmentStatus
  
          FROM buses b
          LEFT JOIN bus_daily_assignments a
            ON a.bus_id = b.id
           AND a.terminal_id = ?
           AND a.date = ?
  
          WHERE b.status != 'removed'
          ORDER BY a.daily_number IS NULL, a.daily_number ASC
          `,
        [terminalId, date],
        (err, rows) => {
          if (err) reject(err)
          else resolve(rows)
        }
      )
    })
};




