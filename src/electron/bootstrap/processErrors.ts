import { logger } from "../service/logger.js";

export function registerProcessErrorHandlers(): void {
    process.on("uncaughtException", (err) => {
        logger.error("main", "uncaughtException", err);
    });

    process.on("unhandledRejection", (reason) => {
        logger.error("main", "unhandledRejection", reason);
    });
}
