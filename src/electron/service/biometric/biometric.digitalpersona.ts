

export class DigitalPersonaService implements BiometricService {

  async enroll(userId: number): Promise<string> {
    // llamada al SDK C++ / COM / servicio externo
    return "real-template-from-device";
  }

  async authenticate(): Promise<string | null> {
    return "real-template";
  }
}
