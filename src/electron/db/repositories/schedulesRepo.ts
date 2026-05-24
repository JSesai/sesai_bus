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
          s.arrival AS arrival_time, 
          s.status, 
          s.created_at, 
          s.dateDeparture,
          s.route_id,
          s.bus_id,
          b.plate AS bus_plate,
          b.model AS bus_model,
          s.driver_id,
          ud.name AS driver_name,
          s.agency_id AS agency_id_origin,
          a.name AS agency_name,
          r.terminalName AS terminal_destination,
          a.city AS terminal_origin,
          r.origin AS city_origin,
          r.cityName AS city_destination
        FROM schedules s
        JOIN routes r ON s.route_id = r.id
        JOIN buses b ON s.bus_id = b.id 
        JOIN users ud ON s.driver_id = ud.id 
        JOIN agencies a ON s.agency_id = a.id;
        `,
        (err, rows: any[]) => {
          if (err) reject(err);
          else {
            resolve(rows)
          }
        }
      );
    }),

  getById: (id: number) =>
    new Promise((resolve, reject) => {
      db.get(`SELECT * FROM schedules WHERE id = ?`, [id], (err, row) =>
        err ? reject(err) : resolve(row)
      );
    }),

  // add: (schedule: Schedule) =>
  //   new Promise((resolve, reject) => {
  //     db.run(
  //       `INSERT INTO schedules (route_id, bus_id,vehicle_number, driver_id, agency_id, departure_time, arrival, dateDeparture)
  //        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  //       [
  //         schedule.route_id,
  //         schedule.bus_id,
  //         schedule.vehicle_number,
  //         schedule.driver_id,
  //         schedule.agency_id_origin,
  //         schedule.departure_time,
  //         schedule.arrival_time,
  //         JSON.stringify(schedule.dateDeparture)
  //       ],
  //       function (err) {
  //         if (err) reject(err);
  //         else {
  //           db.get(
  //             `
  //               SELECT 
  //                 s.id AS id, 
  //                 s.vehicle_number, 
  //                 s.departure_time, 
  //                 s.arrival as arrival_time, 
  //                 s.status, 
  //                 s.created_at, 
  //                 s.dateDeparture,
  //                 r.cityName AS route_id,
  //                 b.model AS bus_id,
  //                 ud.name AS driver_id,
  //                 a.name AS agency_id_origin
  //                 FROM schedules s
  //                 JOIN routes r ON s.route_id = r.id
  //                 JOIN buses b ON s.bus_id = b.id 
  //                 JOIN users ud ON s.driver_id = ud.id 
  //                 JOIN agencies a ON s.agency_id = a.id
  //                 WHERE s.id = ?
  //             `, [this.lastID],
  //             (err2, rowGet: any) => {
  //               if (err2) reject(err2)
  //               else {
  //                 const result = {
  //                   ...rowGet,
  //                   dateDeparture: JSON.parse(rowGet.dateDeparture)
  //                 }
  //                 resolve(result);
  //               }
  //             }
  //           )
  //         }
  //       }
  //     );
  //   }),

  add: (schedule: Schedule) =>
    new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO schedules (route_id, bus_id, vehicle_number, driver_id, agency_id, departure_time, arrival, dateDeparture)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          schedule.route_id,
          schedule.bus_id,
          schedule.vehicle_number,
          schedule.driver_id,
          schedule.agency_id_origin,
          schedule.departure_time,
          schedule.arrival_time,
          schedule.dateDeparture,
        ],
        function (err) {
          if (err) reject(err);
          else {
            db.get(
              `
            SELECT 
              s.id, 
              s.vehicle_number, 
              s.departure_time, 
              s.arrival AS arrival_time, 
              s.status, 
              s.created_at, 
              s.dateDeparture,
              s.route_id,
              r.cityName AS city_destination,
              r.origin AS city_origin,
              s.bus_id,
              b.plate AS bus_plate,
              b.model AS bus_model,
              s.driver_id,
              ud.name AS driver_name,
              s.agency_id,
              a.name AS agency_id_origin
            FROM schedules s
            JOIN routes r ON s.route_id = r.id
            JOIN buses b ON s.bus_id = b.id 
            JOIN users ud ON s.driver_id = ud.id 
            JOIN agencies a ON s.agency_id = a.id
            WHERE s.id = ?
            `,
              [this.lastID],
              (err2, rowGet: any) => {
                if (err2) reject(err2)
                else {

                  resolve(rowGet);
                }
              }
            )
          }
        }
      );
    }),

  // update: (schedule: Schedule) =>
  //   new Promise((resolve, reject) => {
  //     db.run(
  //       `UPDATE schedules SET 
  //         route_id = COALESCE(?, route_id),
  //         bus_id = COALESCE(?, bus_id),
  //         driver_id = COALESCE(?, driver_id),
  //         agency_id = COALESCE(?, agency_id),
  //         departure_time = COALESCE(?, departure_time),
  //         arrival = COALESCE(?, arrival)
  //        WHERE id = ?`,
  //       [
  //         schedule.route_id,
  //         schedule.bus_id,
  //         schedule.driver_id,
  //         schedule.agency_id_origin,
  //         schedule.departure_time,
  //         schedule.arrival_time,
  //         schedule.id,
  //       ],
  //       function (err) {
  //         if (err) reject(err);
  //         else resolve({ changes: this.changes });
  //       }
  //     );
  //   }),

  update: (schedule: Schedule) =>
    new Promise((resolve, reject) => {
      db.run(
        `UPDATE schedules SET 
          route_id = COALESCE(?, route_id),
          bus_id = COALESCE(?, bus_id),
          driver_id = COALESCE(?, driver_id),
          agency_id = COALESCE(?, agency_id),
          vehicle_number = COALESCE(?, vehicle_number),
          departure_time = COALESCE(?, departure_time),
          arrival = COALESCE(?, arrival),
          dateDeparture = COALESCE(?, dateDeparture)
         WHERE id = ?`,
        [
          schedule.route_id,
          schedule.bus_id,
          schedule.driver_id,
          schedule.agency_id_origin,
          schedule.vehicle_number,
          schedule.departure_time,
          schedule.arrival_time,
          schedule.dateDeparture,
          schedule.id,
        ],
        function (err) {
          if (err) reject(err);
          else {
            // Recuperamos el registro actualizado con joins
            db.get(
              `
              SELECT 
                s.id,
                s.vehicle_number,
                s.departure_time,
                s.arrival AS arrival_time,
                s.status,
                s.created_at,
                s.dateDeparture,
                s.route_id,
                r.cityName AS route_name,
                s.bus_id,
                b.plate AS bus_plate,
                b.model AS bus_model,
                s.driver_id,
                r.origin AS city_origin,
                r.cityName AS city_destination,
                ud.name AS driver_name,
                s.agency_id AS agency_id_origin,    
                r.terminalName AS terminal_destination,            
                a.name AS agency_name
              FROM schedules s
              JOIN routes r ON s.route_id = r.id
              JOIN buses b ON s.bus_id = b.id
              JOIN users ud ON s.driver_id = ud.id
              JOIN agencies a ON s.agency_id = a.id
              WHERE s.id = ?
              `,
              [schedule.id],
              (err2, rowGet: any) => {
                if (err2) reject(err2);
                else {
                  resolve(rowGet);
                }
              }
            );
          }
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

  getVehicleSeatStatus: (scheduleId: number) =>
    new Promise((resolve, reject) => {
      db.all(
        `
            WITH RECURSIVE seat_numbers(seat_number) AS (
              SELECT 1
              UNION ALL
              SELECT seat_number + 1
              FROM seat_numbers
              WHERE seat_number < (
                SELECT b.seatingCapacity
                FROM buses b
                JOIN schedules s ON s.bus_id = b.id
                WHERE s.id = ?
              )
            )
            SELECT sn.seat_number,
                   CASE 
                     WHEN t.status = 'occupied' THEN 'occupied'
                     WHEN t.status = 'selected' THEN 'selected'
                     WHEN t.status = 'selectedTemporal' THEN 'selectedTemporal'
                     WHEN t.status = 'reserved' THEN 'reserved'
                     ELSE 'available'
                   END AS status
            FROM seat_numbers sn
            LEFT JOIN tickets t 
              ON t.schedule_id = ? 
             AND t.seat_number = sn.seat_number
            ORDER BY sn.seat_number;
            `,
        [scheduleId, scheduleId], // parámetros para los dos "?"
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    }),
};
