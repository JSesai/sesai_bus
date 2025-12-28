import { ipcMain } from "electron";
import { createBiometricService } from "../../service/biometric/biometric.factory.js";

const biometricService = createBiometricService();

export function registerBiometricHandlers() {

  ipcMain.handle("biometric:enroll", async (_e, userId: number) => {
    return biometricService.enroll(userId);
  });

  ipcMain.handle("biometric:auth", async () => {
    return biometricService.authenticate();
  });

}
