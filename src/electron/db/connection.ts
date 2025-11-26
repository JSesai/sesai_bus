import sqlite3 from "sqlite3";
import path from "path";
import { app } from "electron";

let db: sqlite3.Database | null = null;

export function getDB(): sqlite3.Database {
    if (db) return db; // ⭐ Ya existe, devolver la misma

    console.log("Iniciando conexión única a la BD");

    const dbPath = path.join(app.getPath("userData"), "taquilla.db");

    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error("NO SE PUDO CONECTAR CON LA BD:", err);
        } else {
            console.log("BD conectada en:", dbPath);
        }
    });

    return db;
}
