import { getDB } from "../connection.js";

const db = getDB();

export const routesTravelRepo = {
  getAll: () =>
    new Promise((resolve, reject) => {
      db.all("SELECT * FROM routes", (err, rows) => (err ? reject(err) : resolve(rows)));
    }),

  getById: (id: number) =>
    new Promise((resolve, reject) => {
      db.get("SELECT * FROM routes WHERE id = ?", [id], (err, row) =>
        err ? reject(err) : resolve(row)
      );
    }),

  add: (route: Route) =>
    new Promise((resolve, reject) => {
      const { origin, terminalName, cityName, address, baseFare, estimatedTravelTime, distanceFromOriginKm, remarks, contactPhone } = route;
      db.run(
        "INSERT INTO routes (origin, terminalName, cityName, address, baseFare, estimatedTravelTime, distanceFromOriginKm, remarks, contactPhone) VALUES (?,?,?,?,?,?,?,?,?)",
        [origin, terminalName, cityName, address, baseFare, estimatedTravelTime, distanceFromOriginKm, remarks, contactPhone],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...route });
        }
      );
    }),

  update: (route: Route) =>
    new Promise((resolve, reject) => {
      db.run(
        `UPDATE routes SET
        origin = COALESCE(?, origin),
        terminalName = COALESCE(?, terminalName), 
        cityName = COALESCE(?, cityName),
        address = COALESCE(?, address), 
        baseFare = COALESCE(?, baseFare),
        estimatedTravelTime = COALESCE(?, estimatedTravelTime), 
        distanceFromOriginKm = COALESCE(?, distanceFromOriginKm), 
        remarks = COALESCE(?, remarks), 
        contactPhone = COALESCE(?, contactPhone) 
        WHERE id = ?`,
        [
          route.origin,
          route.terminalName,
          route.cityName,
          route.address,
          route.baseFare,
          route.estimatedTravelTime,
          route.distanceFromOriginKm,
          route.remarks,
          route.contactPhone,
          route.id,
        ],
        function (err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        });
    }),

  delete: (id: number) =>
    new Promise((resolve, reject) => {
      db.run("DELETE FROM routes WHERE id = ?", [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    }),
};
