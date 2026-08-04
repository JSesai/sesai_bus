import { app } from "electron";
import fs from "fs";
import path from "path";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
    id: number;
    ts: string;
    level: LogLevel;
    scope: string;
    message: string;
}

const LEVEL_ORDER: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MAX_ARCHIVES = 3;
const DEFAULT_LIMIT = 200;

let logFilePath = "";
let minLevel: LogLevel = "debug";
let seq = 0;

function timestamp(): string {
    return new Date().toISOString();
}

const MASKED_KEYS: [RegExp, number][] = [
    [/password|passwd/i, 0],
    [/token|secret|jwt|authorization|session/i, 2],
    [/pin/i, 2],
];

function maskValue(value: any, reveal: number): any {
    const s = String(value ?? "");
    if (s.length === 0) return s;
    if (reveal === 0) return "•".repeat(s.length);
    return s.slice(0, Math.min(reveal, s.length)) + "•".repeat(s.length - Math.min(reveal, s.length));
}

export function sanitize(obj: any, depth = 0): any {
    if (depth > 5) return "[profundidad máx]";
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") return obj;
    if (obj instanceof Error) {
        return { name: obj.name, message: obj.message, stack: obj.stack };
    }
    if (Array.isArray(obj)) {
        if (obj.length > 50) return `[Array(${obj.length})]`;
        return obj.map((v) => sanitize(v, depth + 1));
    }
    if (typeof obj === "object") {
        const out: Record<string, any> = {};
        for (const key of Object.keys(obj)) {
            let reveal: number | null = null;
            for (const [re, r] of MASKED_KEYS) {
                if (re.test(key)) {
                    reveal = r;
                    break;
                }
            }
            out[key] = reveal === null ? sanitize(obj[key], depth + 1) : maskValue(obj[key], reveal);
        }
        return out;
    }
    return String(obj);
}

function formatLine(entry: LogEntry): string {
    const line = `${entry.ts} [${entry.level.toUpperCase()}] [${entry.scope}] ${entry.message}`;
    return line;
}

function rotateIfNeeded(): void {
    try {
        const st = fs.statSync(logFilePath);
        if (st.size < MAX_FILE_SIZE) return;
        const del = `${logFilePath}.${MAX_ARCHIVES}`;
        if (fs.existsSync(del)) fs.unlinkSync(del);
        for (let i = MAX_ARCHIVES - 1; i >= 1; i--) {
            const from = `${logFilePath}.${i}`;
            const to = `${logFilePath}.${i + 1}`;
            if (fs.existsSync(from)) fs.renameSync(from, to);
        }
        if (fs.existsSync(logFilePath)) fs.renameSync(logFilePath, `${logFilePath}.1`);
    } catch {
        // si no se puede rotar, se sigue escribiendo en el mismo archivo
    }
}

function appendLine(line: string): void {
    if (!logFilePath) return;
    try {
        rotateIfNeeded();
        fs.appendFileSync(logFilePath, line + "\n", "utf8");
    } catch {
        // el log no debe romper la app si el archivo no se puede escribir
    }
}

export function log(level: LogLevel, scope: string, message: string, meta?: any): void {
    if (LEVEL_ORDER[level] < LEVEL_ORDER[minLevel]) return;
    const entry: LogEntry = {
        id: ++seq,
        ts: timestamp(),
        level,
        scope,
        message: meta !== undefined ? `${message} ${JSON.stringify(sanitize(meta))}` : message,
    };
    const line = formatLine(entry);
    const consoleFn = level === "error" ? console.error : level === "warn" ? console.warn : level === "debug" ? console.debug : console.log;
    consoleFn(line);
    appendLine(line);
}

export function initLogger(): void {
    try {
        const dir = path.join(app.getPath("userData"), "logs");
        fs.mkdirSync(dir, { recursive: true });
        logFilePath = path.join(dir, "app.log");
    } catch {
        // si no se puede inicializar el archivo, el logger sigue saliendo por consola
    }
}

export function setLogLevel(level: LogLevel): void {
    minLevel = level;
}

const LINE_RE = /^(\d{4}-\d{2}-\d{2}T[^ ]+)\s+\[(DEBUG|INFO|WARN|ERROR)\]\s+\[([^\]]+)\]\s+([\s\S]*)$/;

export function getRecentLogs(limit = DEFAULT_LIMIT, level?: LogLevel): LogEntry[] {
    const entries: LogEntry[] = [];
    if (logFilePath) {
        try {
            const raw = fs.readFileSync(logFilePath, "utf8");
            const lines = raw.split("\n").filter((l) => l.trim().length > 0);
            const start = Math.max(0, lines.length - limit * 4);
            for (let i = lines.length - 1; i >= start && entries.length < limit; i--) {
                const m = LINE_RE.exec(lines[i]);
                if (!m) continue;
                const entryLevel = m[2].toLowerCase() as LogLevel;
                if (level && LEVEL_ORDER[entryLevel] < LEVEL_ORDER[level]) continue;
                entries.push({ id: ++seq, ts: m[1], level: entryLevel, scope: m[3], message: m[4] });
            }
        } catch {
            // sin archivo, sin entradas
        }
    }
    return entries;
}

export function clearLogFile(): void {
    try {
        if (logFilePath && fs.existsSync(logFilePath)) fs.writeFileSync(logFilePath, "", "utf8");
    } catch {
        // ignorar
    }
}

export const logger = {
    debug: (scope: string, message: string, meta?: any) => log("debug", scope, message, meta),
    info: (scope: string, message: string, meta?: any) => log("info", scope, message, meta),
    warn: (scope: string, message: string, meta?: any) => log("warn", scope, message, meta),
    error: (scope: string, message: string, meta?: any) => log("error", scope, message, meta),
};
