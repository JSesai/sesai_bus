import crypto from "crypto";
import pkg from "node-machine-id";
const { machineIdSync } = pkg;

const LICENSE_SECRET = "taquilla-sesai-license-secret-2024";

export function getMachineId(): string {
  return machineIdSync(true);
}

export function signLicense(licenseData: Omit<License, "signature">): string {
  const payload = `${licenseData.machineId}|${licenseData.licenseKey}|${licenseData.licenseType}|${licenseData.maxUsers}|${licenseData.expiresAt}|${licenseData.activatedAt}`;
  return crypto.createHmac("sha256", LICENSE_SECRET).update(payload).digest("hex");
}

export function verifyLicense(license: License): boolean {
  const expectedSignature = signLicense({
    machineId: license.machineId,
    licenseKey: license.licenseKey,
    licenseType: license.licenseType,
    maxUsers: license.maxUsers,
    expiresAt: license.expiresAt,
    activatedAt: license.activatedAt,
  });
  return crypto.timingSafeEqual(
    Buffer.from(license.signature, "hex"),
    Buffer.from(expectedSignature, "hex")
  );
}

export function isLicenseExpired(license: License): boolean {
  const now = new Date();
  const expiry = new Date(license.expiresAt);
  return now > expiry;
}

export function getDaysRemaining(license: License): number {
  const now = new Date();
  const expiry = new Date(license.expiresAt);
  const diff = expiry.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
