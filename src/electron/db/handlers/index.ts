import { registerAgenciesHandlers } from "./agenciesHandlers.js";
import { registerAppConfigHandlers } from "./appConfigHandlers.js";
import { registerBiometricHandlers } from "./biometricHandlers.js";
import { registerBoardingHandlers } from "./boardingHandlers.js";
import { registerCashClosingHandlers } from "./cashClosingHandlers.js";
import { registerCustomersHandlers } from "./customersHandlers.js";
import { registerDriversHandlers } from "./driversHandlers.js";
import { registerLicenseHandlers } from "./licenseHandlers.js";
import { registerLogsHandlers } from "./logsHandlers.js";
import { registerPaymentsHandlers } from "./paymentsHandlers.js";
import { registerProcessFlowHandlers } from "./processFlowHandlers.js";
import { registerRoutesHandlersTravel } from "./routesHandlersTravel.js";
import { registerSchedulesHandlers } from "./schedulesHandlers.js";
import { registerTicketsHandlers } from "./ticketsHandlers.js";
import { registerUserHandlers } from "./userHandlers.js";
import { registerWaitingRoomHandlers } from "./waitingRoomHandlers.js";
import { registerPrinterHandlers } from "../../service/printer/printer.service.js";
import { busesHandlers } from "./busesHandlers.js";

export function registerAllHandlers(): void {
    registerAppConfigHandlers();
    registerUserHandlers();
    registerAgenciesHandlers();
    busesHandlers();
    registerDriversHandlers();
    registerRoutesHandlersTravel();
    registerSchedulesHandlers();
    registerCustomersHandlers();
    registerTicketsHandlers();
    registerPaymentsHandlers();
    registerBiometricHandlers();
    registerProcessFlowHandlers();
    registerPrinterHandlers();
    registerLicenseHandlers();
    registerCashClosingHandlers();
    registerBoardingHandlers();
    registerLogsHandlers();
    registerWaitingRoomHandlers();
}
