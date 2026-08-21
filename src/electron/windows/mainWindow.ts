import { app, BrowserWindow } from "electron";
import isDev from "electron-is-dev";
import path from "path";
import { getPreloadPath } from "../pathResolver.js";

export function createMainWindow(): BrowserWindow {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: getPreloadPath(),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    if (isDev) {
        mainWindow.loadURL("http://localhost:5173");
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
    }

    return mainWindow;
}
