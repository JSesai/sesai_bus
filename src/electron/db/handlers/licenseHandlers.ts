import { ipcMain } from "electron";
import { licenseStore } from "../../security/license-store.js";
import { verifyLicense, isLicenseExpired, getDaysRemaining } from "../../security/license.js";
import { activateLicenseAPI } from "../../security/license-api.js";
import { AppError, ValidationError } from "../../../shared/errors/customError.js";

export function registerLicenseHandlers() {
  ipcMain.handle("checkLicense", async (): Promise<ResponseElectronLicense> => {
    try {
      const license = licenseStore.get();

      if (!license) {
        return {
          ok: true,
          data: { valid: false, license: null, daysRemaining: null, expired: false, message: "No hay licencia activa" },
          error: null,
        };
      }

      const signatureValid = verifyLicense(license);
      if (!signatureValid) {
        licenseStore.clear();
        return {
          ok: true,
          data: { valid: false, license: null, daysRemaining: null, expired: false, message: "Licencia inválida o corrupta" },
          error: null,
        };
      }

      const expired = isLicenseExpired(license);
      if (expired) {
        return {
          ok: true,
          data: { valid: false, license, daysRemaining: 0, expired: true, message: "Licencia expirada" },
          error: null,
        };
      }

      const daysRemaining = getDaysRemaining(license);
      return {
        ok: true,
        data: { valid: true, license, daysRemaining, expired: false, message: "Licencia válida" },
        error: null,
      };
    } catch (error) {
      console.log("error checking license", error);
      if (error instanceof AppError) {
        return { ok: false, data: null, error: { message: error.message, detail: error.details || "" } };
      }
      return { ok: false, data: null, error: { message: "Error interno", detail: "No fue posible verificar la licencia" } };
    }
  });

  ipcMain.handle("activateLicense", async (_event, data: LicenseActivation): Promise<ResponseElectronLicense> => {
    try {
      if (!data.licenseKey || data.licenseKey.trim().length === 0) {
        throw new ValidationError("Clave requerida", "Ingresa una clave de licencia válida");
      }

      const existingLicense = licenseStore.get();
      if (existingLicense) {
        const sigValid = verifyLicense(existingLicense);
        const notExpired = sigValid && !isLicenseExpired(existingLicense);
        if (notExpired) {
          return {
            ok: true,
            data: { valid: true, license: existingLicense, daysRemaining: getDaysRemaining(existingLicense), expired: false, message: "Ya existe una licencia activa" },
            error: null,
          };
        }
        licenseStore.clear();
      }

      const response = await activateLicenseAPI(data.licenseKey.trim());

      if (!response.ok || !response.license) {
        return {
          ok: false,
          data: null,
          error: { message: "Error al activar", detail: response.error || "No fue posible activar la licencia" },
        };
      }

      const sigValid = verifyLicense(response.license);
      if (!sigValid) {
        return {
          ok: false,
          data: null,
          error: { message: "Error de seguridad", detail: "La licencia recibida no es válida" },
        };
      }

      licenseStore.set(response.license);

      return {
        ok: true,
        data: { valid: true, license: response.license, daysRemaining: getDaysRemaining(response.license), expired: false, message: "Licencia activada correctamente" },
        error: null,
      };
    } catch (error) {
      console.log("error activating license", error);
      if (error instanceof AppError) {
        return { ok: false, data: null, error: { message: error.message, detail: error.details || "" } };
      }
      return { ok: false, data: null, error: { message: "Error interno", detail: "No fue posible activar la licencia" } };
    }
  });

  ipcMain.handle("getLicenseStatus", async (): Promise<ResponseElectronLicenseStatus> => {
    try {
      const license = licenseStore.get();

      if (!license) {
        return {
          ok: true,
          data: { valid: false, license: null, daysRemaining: null, expired: false, message: "Sin licencia" },
          error: null,
        };
      }

      const signatureValid = verifyLicense(license);
      const expired = isLicenseExpired(license);
      const daysRemaining = getDaysRemaining(license);
      const valid = signatureValid && !expired;

      return {
        ok: true,
        data: { valid, license, daysRemaining, expired, message: valid ? "Licencia activa" : expired ? "Licencia expirada" : "Licencia inválida" },
        error: null,
      };
    } catch (error) {
      console.log("error getting license status", error);
      return { ok: false, data: null, error: { message: "Error interno", detail: "No fue posible obtener el estado de la licencia" } };
    }
  });
}
