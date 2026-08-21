import { ipcMain } from "electron";
import { loadWaitingRoomConfig, saveWaitingRoomConfig } from "../../service/waitingRoom/waitingRoomConfig.js";
import {
    hideWaitingRoom,
    isWaitingRoomVisible,
    notifyWaitingRoomConfig,
    showWaitingRoom,
} from "../../service/waitingRoom/waitingRoomWindow.js";
import { getWaitingRoomUrl } from "../../service/waitingRoom/waitingRoomServer.js";

export function registerWaitingRoomHandlers(): void {
    ipcMain.handle("openWaitingRoom", () => {
        showWaitingRoom();
        return { ok: true };
    });

    ipcMain.handle("closeWaitingRoom", () => {
        hideWaitingRoom();
        return { ok: true };
    });

    ipcMain.handle("toggleWaitingRoom", () => {
        if (isWaitingRoomVisible()) hideWaitingRoom();
        else showWaitingRoom();
        return { ok: true, data: { isOpen: isWaitingRoomVisible() }, error: null };
    });

    ipcMain.handle("getWaitingRoomStatus", () => ({
        ok: true,
        data: { isOpen: isWaitingRoomVisible() },
        error: null,
    }));

    ipcMain.handle("getWaitingRoomUrl", () => ({
        ok: true,
        data: getWaitingRoomUrl(),
        error: null,
    }));

    ipcMain.handle("getWaitingRoomConfig", () => ({
        ok: true,
        data: loadWaitingRoomConfig(),
        error: null,
    }));

    ipcMain.handle("saveWaitingRoomConfig", (_e, partial: Partial<WaitingRoomConfig>) => {
        const config = loadWaitingRoomConfig();
        const updated = { ...config, ...partial };
        saveWaitingRoomConfig(updated);
        if (partial.fontScale !== undefined) {
            notifyWaitingRoomConfig(updated);
        }
        return { ok: true, data: null, error: null };
    });
}
