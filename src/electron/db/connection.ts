import sqlite3 from "sqlite3";
import path from "path";
import { app } from "electron";

let db: sqlite3.Database | null = null;

function runMigrations(database: sqlite3.Database) {
    database.run(
        "ALTER TABLE app_config ADD COLUMN min_advance_minutes INTEGER DEFAULT 30",
        (err) => {
            if (err && !err.message.includes("duplicate column")) {
                console.error("Error en migración min_advance_minutes:", err);
            }
        }
    );
    database.run(
        "ALTER TABLE app_config ADD COLUMN service_fee_percent INTEGER DEFAULT 0",
        (err) => {
            if (err && !err.message.includes("duplicate column")) {
                console.error("Error en migración service_fee_percent:", err);
            }
        }
    );
    database.run(
        "ALTER TABLE tickets ADD COLUMN cancel_reason TEXT",
        (err) => {
            if (err && !err.message.includes("duplicate column")) {
                console.error("Error en migración cancel_reason:", err);
            }
        }
    );
    database.run(
        "ALTER TABLE tickets ADD COLUMN cancelled_at TEXT",
        (err) => {
            if (err && !err.message.includes("duplicate column")) {
                console.error("Error en migración cancelled_at:", err);
            }
        }
    );
    database.run(
        "ALTER TABLE tickets ADD COLUMN boarded_at TEXT",
        (err) => {
            if (err && !err.message.includes("duplicate column")) {
                console.error("Error en migración boarded_at:", err);
            }
        }
    );
    database.run(
        "ALTER TABLE tickets ADD COLUMN boarded_by INTEGER",
        (err) => {
            if (err && !err.message.includes("duplicate column")) {
                console.error("Error en migración boarded_by:", err);
            }
        }
    );
    database.run(
        "ALTER TABLE app_config ADD COLUMN boarding_pin TEXT",
        (err) => {
            if (err && !err.message.includes("duplicate column")) {
                console.error("Error en migración boarding_pin:", err);
            }
        }
    );
    database.run(
        "ALTER TABLE buses ADD COLUMN inapam_seats INTEGER NOT NULL DEFAULT 0",
        (err) => {
            if (err && !err.message.includes("duplicate column")) {
                console.error("Error en migración inapam_seats:", err);
            }
        }
    );
    // Reemplaza el índice único absoluto por uno parcial: permite re-vender un asiento
    // cancelado (quedando disponible para compra) conservando el histórico de cancelaciones.
    database.run("DROP INDEX IF EXISTS idx_unique_seat_per_schedule", (err) => {
        if (err) {
            console.error("Error en migración drop idx_unique_seat_per_schedule:", err);
        }
    });
    database.run(
        `CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_seat_per_schedule
         ON tickets(schedule_id, seat_number)
         WHERE status != 'cancelled'`,
        (err) => {
            if (err) {
                console.error("Error en migración idx_unique_active_seat_per_schedule:", err);
            }
        }
    );
    database.run(
        `CREATE TABLE IF NOT EXISTS cash_closings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            agency_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            closing_date TEXT NOT NULL,
            opening_time TEXT NOT NULL,
            closing_time TEXT,
            total_cash REAL DEFAULT 0,
            total_card REAL DEFAULT 0,
            total_transfer REAL DEFAULT 0,
            total_sales REAL DEFAULT 0,
            total_reservations REAL DEFAULT 0,
            total_cancellations REAL DEFAULT 0,
            total_service_fees REAL DEFAULT 0,
            transaction_count INTEGER DEFAULT 0,
            status TEXT CHECK(status IN ('open','closed')) DEFAULT 'open',
            notes TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (agency_id) REFERENCES agencies(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`,
        (err) => {
            if (err) {
                console.error("Error en migración cash_closings:", err);
            }
        }
    );
}

export function getDB(): sqlite3.Database {
    if (db) return db; // ⭐ Ya existe, devolver la misma

    console.log("Iniciando conexión única a la BD");

    const dbPath = path.join(app.getPath("userData"), "taquilla.db");

    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error("NO SE PUDO CONECTAR CON LA BD:", err);
        } else {
            console.log("BD conectada en:", dbPath);
            if (db) runMigrations(db);
        }
    });

    return db;
}
