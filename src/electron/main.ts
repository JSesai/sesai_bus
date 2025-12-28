import { app, BrowserWindow } from "electron";
import isDev from "electron-is-dev";
import path from "path";
import { getPreloadPath } from "./pathResolver.js";
import { initDatabase } from "./db/migration.js";
import { getDB } from "./db/connection.js";
import { registerUserHandlers } from "./db/handlers/userHandlers.js";
import { registerAgenciesHandlers } from "./db/handlers/agenciesHandlers.js";
import { registerDriversHandlers } from "./db/handlers/driversHandlers.js";
import { registerBusesHandlers } from "./db/handlers/busesHandlers.js";
import { registerRoutesHandlersTravel } from "./db/handlers/routesHandlersTravel.js";
import { registerSchedulesHandlers } from "./db/handlers/schedulesHandlers.js";
import { registerCustomersHandlers } from "./db/handlers/customersHandlers.js";
import { registerTicketsHandlers } from "./db/handlers/ticketsHandlers.js";
import { registerPaymentsHandlers } from "./db/handlers/paymentsHandlers.js";
import { registerBiometricHandlers } from "./db/handlers/biometricHandlers.js";



async function createWindow() {
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
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools(); //habilita las devtools
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
    }
}

let db = getDB()

app.whenReady().then(async () => {
    await initDatabase(db);
    createWindow();
    registerUserHandlers();
    registerAgenciesHandlers();
    registerBusesHandlers();
    registerDriversHandlers();
    registerRoutesHandlersTravel();
    registerSchedulesHandlers();
    registerCustomersHandlers();
    registerTicketsHandlers();
    registerPaymentsHandlers();
    registerBiometricHandlers();


});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
app.on("before-quit", () => {
    if (!db) return;
    db.close((err) => {
        if (err) console.error("Error cerrando la BD:", err);
        else console.log("BD cerrada correctamente");
    });

});
