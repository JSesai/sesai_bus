import { app, BrowserWindow } from "electron";
import isDev from "electron-is-dev";
import path from "path";
import { getPreloadPath } from "../../pathResolver.js";
import { loadWaitingRoomConfig, saveWaitingRoomConfig } from "./waitingRoomConfig.js";

let waitingRoomWindow: BrowserWindow | null = null;
let visible = false;

function getWaitingRoomUrl(): string {
    return isDev
        ? "http://localhost:5173/?view=waiting-room"
        : `file://${path.join(app.getAppPath(), "/dist-react/index.html")}?view=waiting-room`;
}

function setOpenState(isOpen: boolean): void {
    const config = loadWaitingRoomConfig();
    if (config.isOpen === isOpen) return;
    saveWaitingRoomConfig({ ...config, isOpen });
}

function createWaitingRoomWindow(): void {
    waitingRoomWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        title: "Sala de Espera - Salidas",
        frame: false,
        closable: false,
        minimizable: false,
        maximizable: false,
        webPreferences: {
            preload: getPreloadPath(),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    waitingRoomWindow.maximize();
    waitingRoomWindow.loadURL(getWaitingRoomUrl());

    waitingRoomWindow.on("closed", () => {
        waitingRoomWindow = null;
        visible = false;
    });

    visible = true;
    setOpenState(true);
}

export function showWaitingRoom(): void {
    if (waitingRoomWindow && !waitingRoomWindow.isDestroyed()) {
        waitingRoomWindow.show();
        waitingRoomWindow.focus();
        visible = true;
        setOpenState(true);
    } else {
        createWaitingRoomWindow();
    }
}

export function hideWaitingRoom(): void {
    if (!waitingRoomWindow || waitingRoomWindow.isDestroyed()) return;
    waitingRoomWindow.hide();
    visible = false;
    setOpenState(false);
}

export function isWaitingRoomVisible(): boolean {
    return visible;
}

export function notifyWaitingRoomConfig(config: WaitingRoomConfig): void {
    if (waitingRoomWindow && !waitingRoomWindow.isDestroyed()) {
        waitingRoomWindow.webContents.send("waitingRoomConfigUpdated", config);
    }
}
