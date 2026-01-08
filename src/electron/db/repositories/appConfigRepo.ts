import { getDB } from "../connection.js";

const db = getDB();

export const appConfigRepo = {
    getConfig: () =>
        new Promise((resolve, reject) => {
            db.get(
                "SELECT * FROM app_config WHERE id = 1",
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row ?? null);
                }
            );
        }),

    createDefault: () =>
        new Promise((resolve, reject) => {
            db.run(
                `
                INSERT INTO app_config (
                  id,
                  agency_configured,
                  buses_configured,
                  routes_configured,
                  schedules_configured,
                  initial_setup_completed
                ) VALUES (1, 0, 0, 0, 0, 0)
                `,
                function (err) {
                    if (err) reject(err);
                    else resolve(true);
                }
            );
        }),

    update: (fields: Partial<any>) => {
        const keys = Object.keys(fields);
        const values = Object.values(fields);

        const setClause = keys.map(k => `${k} = ?`).join(", ");

        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE app_config SET ${setClause} WHERE id = 1`,
                values,
                function (err) {
                    if (err) reject(err);
                    else resolve({ changes: this.changes });
                }
            );
        });
    }

};
