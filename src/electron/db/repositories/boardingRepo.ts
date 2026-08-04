import { getDB } from "../connection.js";

const db = getDB();

export const boardingRepo = {
  getDeparturesByDate: (date: string): Promise<BoardingDeparture[]> =>
    new Promise((resolve, reject) => {
      db.all(
        `
        SELECT
          s.id,
          s.departure_time,
          s.arrival AS arrival_time,
          s.vehicle_number,
          s.status,
          s.dateDeparture,
          r.terminalName AS terminal_destination,
          r.cityName AS city_destination,
          r.origin AS city_origin,
          r.estimatedTravelTime,
          b.plate AS bus_plate,
          b.model AS bus_model,
          b.seatingCapacity,
          ud.name AS driver_name,
          a.name AS agency_name,
          (SELECT COUNT(*) FROM tickets t
           WHERE t.schedule_id = s.id
             AND t.status IN ('occupied','reserved')) AS occupied_seats,
          (SELECT COUNT(*) FROM tickets t
           WHERE t.schedule_id = s.id
             AND t.status IN ('occupied','reserved')
             AND t.boarded_at IS NOT NULL) AS boarded_seats
        FROM schedules s
        JOIN routes r ON s.route_id = r.id
        JOIN buses b ON s.bus_id = b.id
        JOIN users ud ON s.driver_id = ud.id
        JOIN agencies a ON s.agency_id = a.id
        WHERE DATE(s.dateDeparture) = DATE(?)
          AND s.status = 'active'
        ORDER BY s.departure_time ASC
        `,
        [date],
        (err, rows: any[]) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    }),

  getBoardingManifest: (scheduleId: number): Promise<BoardingManifestRow[]> =>
    new Promise((resolve, reject) => {
      db.all(
        `
        SELECT
          t.id AS ticket_id,
          t.seat_number,
          t.price,
          t.status,
          t.boarded_at,
          t.boarded_by,
          t.return_date,
          t.customer_id,
          c.name AS customer_name,
          c.phone AS customer_phone
        FROM tickets t
        JOIN customers c ON t.customer_id = c.id
        WHERE t.schedule_id = ?
          AND t.status IN ('occupied','reserved')
        ORDER BY t.seat_number ASC
        `,
        [scheduleId],
        (err, rows: any[]) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    }),

  getTicketsByIds: (ticketIds: number[]): Promise<BoardingTicketInfo[]> =>
    new Promise((resolve, reject) => {
      if (ticketIds.length === 0) return resolve([]);

      const placeholders = ticketIds.map(() => "?").join(", ");
      db.all(
        `
        SELECT
          t.id AS ticket_id,
          t.seat_number,
          t.price,
          t.status,
          t.boarded_at,
          t.customer_id,
          c.name AS customer_name,
          c.phone AS customer_phone,
          s.id AS schedule_id,
          s.departure_time,
          s.dateDeparture,
          s.vehicle_number,
          r.origin AS city_origin,
          r.cityName AS city_destination
        FROM tickets t
        JOIN customers c ON t.customer_id = c.id
        JOIN schedules s ON t.schedule_id = s.id
        JOIN routes r ON s.route_id = r.id
        WHERE t.id IN (${placeholders})
          AND t.status IN ('occupied','reserved')
        `,
        ticketIds,
        (err, rows: any[]) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    }),

  markBoarded: (ticketIds: number[], userId: number): Promise<number> =>
    new Promise((resolve, reject) => {
      if (ticketIds.length === 0) return resolve(0);

      const placeholders = ticketIds.map(() => "?").join(", ");
      db.run(
        `UPDATE tickets
         SET boarded_at = datetime('now', 'localtime'), boarded_by = ?
         WHERE id IN (${placeholders})`,
        [userId, ...ticketIds],
        function (err) {
          if (err) reject(err);
          else resolve(this.changes || 0);
        }
      );
    }),

  unmarkBoarded: (ticketIds: number[]): Promise<number> =>
    new Promise((resolve, reject) => {
      if (ticketIds.length === 0) return resolve(0);

      const placeholders = ticketIds.map(() => "?").join(", ");
      db.run(
        `UPDATE tickets
         SET boarded_at = NULL, boarded_by = NULL
         WHERE id IN (${placeholders})`,
        ticketIds,
        function (err) {
          if (err) reject(err);
          else resolve(this.changes || 0);
        }
      );
    }),
};
