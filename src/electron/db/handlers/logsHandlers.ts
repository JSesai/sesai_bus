import { ipcMain } from "electron";
import { clearLogFile, getRecentLogs, logger, type LogLevel } from "../../service/logger.js";

export function registerLogsHandlers(): void {
    ipcMain.handle("logs:get", (_e, opts: { limit?: number; level?: LogLevel } = {}) => {
        const entries = getRecentLogs(opts?.limit ?? 200, opts?.level);
        return { ok: true, data: { entries }, error: null };
    });

    ipcMain.handle("logs:clear", () => {
        clearLogFile();
        return { ok: true, data: null, error: null };
    });

    ipcMain.handle("logs:write", (_e, payload: { level?: LogLevel; scope?: string; message?: string; meta?: any }) => {
        const level = payload?.level || "info";
        logger[level](payload?.scope || "renderer", payload?.message || "", payload?.meta);
        return { ok: true, data: null, error: null };
    });
}
