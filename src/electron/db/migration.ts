

import path from "path";
import fs from "fs";
import isDev from "electron-is-dev";
import type { Database } from "sqlite3";

export function getSqlPath() {
    if (isDev) {
        // Ruta en modo desarrollo
        return path.join(process.cwd(), "src/electron/db/taquilla.sql");
    }

    // Ruta en producción (app instalada)
    return path.join(process.resourcesPath, "db/taquilla.sql");
}

export async function initDatabase(db: Database) {
    console.log("Iniciando conexión a la BD");

    if (!db) throw new Error('Error al obtener la instancia de la BD')
    const sqlPath = getSqlPath();
    console.log("Ruta SQL:", sqlPath);

    const sql = fs.readFileSync(sqlPath, "utf8");

    db.exec(sql, (err: any) => {
        if (err) {
            console.error("Error ejecutando SQL", err);
        } else {
            console.log("Migración aplicada correctamente");
        }
    });
}
