import { userRepo } from "../db/repositories/userRepo.js";

export function normalizeUserName(name: string) {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // elimina acentos
        .replace(/[^a-z0-9]/g, "")       // solo letras y números
}


export async function generateUniqueUserName(name: User['userName']) {
    const base = normalizeUserName(name);
    let userName: User['userName'] = base;
    let counter = 1;

    while (await userRepo.getByName(userName)) {
        userName = `${base}${counter}`;
        counter++;
    }

    return userName;
}
