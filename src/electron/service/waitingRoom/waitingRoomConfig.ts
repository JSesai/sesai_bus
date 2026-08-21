import { app } from "electron";
import fs from "fs";
import path from "path";
import { logger } from "../logger.js";

export const DEFAULT_WAITING_ROOM_CONFIG: WaitingRoomConfig = {
    fontScale: 1.45,
    isOpen: false,
};

function getConfigPath(): string {
    return path.join(app.getPath("userData"), "waiting-room-config.json");
}

export function loadWaitingRoomConfig(): WaitingRoomConfig {
    try {
        const raw = fs.readFileSync(getConfigPath(), "utf8");
        const parsed = JSON.parse(raw);
        return normalizeConfig(parsed);
    } catch (err) {
        if ((err as NodeJS.ErrnoException)?.code !== "ENOENT") {
            logger.warn("waiting-room", "No se pudo leer la config, usando valores por defecto", err);
        }
        return { ...DEFAULT_WAITING_ROOM_CONFIG };
    }
}

function normalizeConfig(config: Partial<WaitingRoomConfig>): WaitingRoomConfig {
    const fontScale = typeof config.fontScale === "number" ? config.fontScale : DEFAULT_WAITING_ROOM_CONFIG.fontScale;
    const isOpen = typeof config.isOpen === "boolean" ? config.isOpen : DEFAULT_WAITING_ROOM_CONFIG.isOpen;
    return { fontScale, isOpen };
}

export function saveWaitingRoomConfig(config: WaitingRoomConfig): void {
    try {
        fs.writeFileSync(getConfigPath(), JSON.stringify(config, null, 2), "utf8");
    } catch (err) {
        logger.error("waiting-room", "Error guardando config waiting room", err);
    }
}
