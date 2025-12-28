

export class BiometricMockService implements BiometricService {

  async enroll(userId: number): Promise<string> {
    console.log("Mock enroll for user:", userId);
    return `mock-fingerprint-${userId}`;
  }

  async authenticate(): Promise<string | null> {
    console.log("Mock authenticate");
    return "mock-fingerprint-1";
  }
}
