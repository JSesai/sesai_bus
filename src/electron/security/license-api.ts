import { getMachineId, signLicense } from "./license.js";

// ============================================================
// MOCK - Reemplazar con implementación real de AWS API Gateway
// Cuando tengas el endpoint real, reemplaza este archivo por:
//
// const API_URL = "https://tu-api-id.executeregion.amazonaws.com/prod";
//
// export async function activateLicenseAPI(data) {
//   const response = await fetch(`${API_URL}/activate`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   return response.json();
// }
//
// export async function validateKeyAPI(licenseKey) {
//   const response = await fetch(`${API_URL}/validate-key`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ licenseKey }),
//   });
//   return response.json();
// }
// ============================================================

// Mock keys - Agrega las licencias que quieras generar aquí
const MOCK_KEYS: Record<string, { expiresAt: string; maxUsers: number; type: License["licenseType"] }> = {
  "DEMO-1234-ABCD-5678": { expiresAt: "2027-12-31", maxUsers: 5, type: "standard" },
  "TEST-5678-EFGH-9012": { expiresAt: "2026-06-30", maxUsers: 1, type: "trial" },
  "PROD-9012-IJKL-3456": { expiresAt: "2028-12-31", maxUsers: 10, type: "enterprise" },
};

interface ActivateResponse {
  ok: boolean;
  license: License | null;
  error: string | null;
}

export async function activateLicenseAPI(licenseKey: string): Promise<ActivateResponse> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  const keyData = MOCK_KEYS[licenseKey];
  if (!keyData) {
    return { ok: false, license: null, error: "Clave de licencia inválida" };
  }

  const machineId = getMachineId();
  const now = new Date().toISOString();

  const licenseData: Omit<License, "signature"> = {
    machineId,
    licenseKey,
    licenseType: keyData.type,
    maxUsers: keyData.maxUsers,
    expiresAt: keyData.expiresAt,
    activatedAt: now,
  };

  const signature = signLicense(licenseData);

  const license: License = { ...licenseData, signature };

  return { ok: true, license, error: null };
}

interface ValidateKeyResponse {
  ok: boolean;
  valid: boolean;
  error: string | null;
}

export async function validateKeyAPI(licenseKey: string): Promise<ValidateKeyResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const keyData = MOCK_KEYS[licenseKey];
  if (!keyData) {
    return { ok: true, valid: false, error: null };
  }

  return { ok: true, valid: true, error: null };
}
