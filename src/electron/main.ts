import { app, BrowserWindow } from "electron";
import { getDB } from "./db/connection.js";
import { initDatabase } from "./db/migration.js";
import { registerAllHandlers } from "./db/handlers/index.js";
import { seedAppConfig, seedInitialUser } from "./db/seed.js";
import { initLogger, logger } from "./service/logger.js";
import { startBoardingServer, stopBoardingServer } from "./service/boarding/boardingServer.js";
import { startWaitingRoomServer, stopWaitingRoomServer } from "./service/waitingRoom/waitingRoomServer.js";
import { createMainWindow } from "./windows/mainWindow.js";
import { registerProcessErrorHandlers } from "./bootstrap/processErrors.js";
import { patchIpcLogging } from "./bootstrap/ipcLogging.js";

registerProcessErrorHandlers();
patchIpcLogging();

const db = getDB();

app.whenReady().then(async () => {
    initLogger();
    logger.info("main", "Aplicación iniciada", { version: process.env.npm_package_version || "" });

    await initDatabase(db);
    registerAllHandlers();
    createMainWindow();

    startBoardingServer();
    startWaitingRoomServer();

    await seedInitialUser();
    await seedAppConfig();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

app.on("before-quit", () => {
    logger.info("main", "Cerrando aplicación");
    stopWaitingRoomServer();
    stopBoardingServer();
    if (!db) return;
    db.close((err) => {
        if (err) logger.error("main", "Error cerrando la BD", err);
        else logger.info("main", "BD cerrada correctamente");
    });
});
