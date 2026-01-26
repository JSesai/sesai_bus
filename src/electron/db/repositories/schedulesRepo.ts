import { getDB } from "../connection.js";

const db = getDB();

export const schedulesRepo = {
  getAll: () =>
    new Promise((resolve, reject) => {
      db.all(
        `
        SELECT 
          s.id, 
          s.vehicle_number, 
          s.departure_time, 
          s.arrival as arrival_time, 
          s.status, 
          s.created_at, 
          r.cityName AS route_id,
          b.model AS bus_id,
          ud.name AS driver_id,
          a.name AS agency_id_origin
          FROM schedules s
          JOIN routes r ON s.route_id = r.id
          JOIN buses b ON s.bus_id = b.id 
          JOIN users ud ON s.driver_id = ud.id 
          JOIN agencies a ON s.agency_id = a.id;
        `,
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    }),

  getById: (id: number) =>
    new Promise((resolve, reject) => {
      db.get(`SELECT * FROM schedules WHERE id = ?`, [id], (err, row) =>
        err ? reject(err) : resolve(row)
      );
    }),

  add: (schedule: Schedule) =>
    new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO schedules (route_id, bus_id,vehicle_number, driver_id, agency_id, departure_time, arrival)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          schedule.route_id,
          schedule.bus_id,
          schedule.vehicle_number,
          schedule.driver_id,
          schedule.agency_id_origin,
          schedule.departure_time,
          schedule.arrival_time,
        ],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...schedule });
        }
      );
    }),

  update: (schedule: {
    id: number;
    route_id?: number;
    bus_id?: number;
    driver_id?: number;
    agency_id?: number;
    departure_time?: string;
    arrival?: string;
  }) =>
    new Promise((resolve, reject) => {
      db.run(
        `UPDATE schedules SET 
          route_id = COALESCE(?, route_id),
          bus_id = COALESCE(?, bus_id),
          driver_id = COALESCE(?, driver_id),
          agency_id = COALESCE(?, agency_id),
          departure_time = COALESCE(?, departure_time),
          arrival = COALESCE(?, arrival)
         WHERE id = ?`,
        [
          schedule.route_id,
          schedule.bus_id,
          schedule.driver_id,
          schedule.agency_id,
          schedule.departure_time,
          schedule.arrival,
          schedule.id,
        ],
        function (err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    }),

  delete: (id: number) =>
    new Promise((resolve, reject) => {
      db.run(`DELETE FROM schedules WHERE id = ?`, [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    }),
};
