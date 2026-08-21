import { ipcMain } from "electron";
import { logger, sanitize } from "../service/logger.js";

function summarizeArgs(args: any[]): string {
    try {
        const json = JSON.stringify(sanitize(args));
        return json.length > 160 ? json.slice(0, 160) + "…" : json;
    } catch {
        return "[no serializable]";
    }
}

export function patchIpcLogging(): void {
    const originalHandle = ipcMain.handle.bind(ipcMain);
    ipcMain.handle = ((channel: string, listener: (...args: any[]) => any) => {
        originalHandle(channel, async (event: any, ...args: any[]) => {
            const start = Date.now();
            logger.debug("ipc", `→ ${channel}`, { args: summarizeArgs(args) });
            try {
                const result = await listener(event, ...args);
                logger.debug("ipc", `← ${channel} ok (${Date.now() - start}ms)`);
                return result;
            } catch (err) {
                logger.error("ipc", `← ${channel} error (${Date.now() - start}ms)`, err);
                throw err;
            }
        });
    }) as typeof ipcMain.handle;
}
