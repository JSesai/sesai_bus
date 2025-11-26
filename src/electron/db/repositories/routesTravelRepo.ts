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

  add: (route: { origin: string; destination: string; distance_km?: number }) =>
    new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO routes (origin, destination, distance_km) VALUES (?, ?, ?)",
        [route.origin, route.destination, route.distance_km || null],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...route });
        }
      );
    }),

  update: (route: { id: number; origin?: string; destination?: string; distance_km?: number }) =>
    new Promise((resolve, reject) => {
      db.run(
        "UPDATE routes SET origin = COALESCE(?, origin), destination = COALESCE(?, destination), distance_km = COALESCE(?, distance_km) WHERE id = ?",
        [route.origin, route.destination, route.distance_km, route.id],
        function (err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    }),

  delete: (id: number) =>
    new Promise((resolve, reject) => {
      db.run("DELETE FROM routes WHERE id = ?", [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    }),
};
