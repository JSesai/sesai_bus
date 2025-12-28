
import os from "os";
import { DigitalPersonaService } from "./biometric.digitalpersona.js";
import { BiometricMockService } from "./biometric.mock.js";


export function createBiometricService(): BiometricService {
  if (os.platform() === "win32") {
    return new DigitalPersonaService();
  }

  return new BiometricMockService();
}
