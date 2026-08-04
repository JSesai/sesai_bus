import { appConfigRepo } from "../../db/repositories/appConfigRepo.js";

function generatePin(): string {
    return String(Math.floor(1000 + Math.random() * 9000));
}

export async function getBoardingPin(): Promise<string> {
    const config: any = await appConfigRepo.getConfig();
    const existing = config?.boarding_pin;
    if (existing && /^\d{4,6}$/.test(existing)) return existing;

    const pin = generatePin();
    await appConfigRepo.update({ boarding_pin: pin });
    return pin;
}

export async function regenerateBoardingPin(): Promise<string> {
    const pin = generatePin();
    await appConfigRepo.update({ boarding_pin: pin });
    return pin;
}

export async function checkBoardingPin(pin: string): Promise<boolean> {
    const current = await getBoardingPin();
    return current === pin;
}
