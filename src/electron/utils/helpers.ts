import { app } from "electron";
import fs from "fs";
import path from "path";
import { userRepo } from "../db/repositories/userRepo.js";
import { agenciesRepo } from "../db/repositories/agenciesRepo.js";
import { sessionStore } from "../security/store-sesion.js";
import { verifyToken } from "../security/jwt.js";

const nameCompany = "MyCompany";

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

    return `${userName}@${nameCompany.toLowerCase()}`;
}


export function getAppMetadata() {
    const appPath = app.getAppPath();
    const packageJsonPath = path.join(appPath, "package.json");

    const raw = fs.readFileSync(packageJsonPath, "utf-8");
    return JSON.parse(raw);
}

export const isCurrentAgency = async (agencyId: number) => {
    const agencyCurrent = await agenciesRepo.getCurrent();
    return agencyCurrent?.isCurrent === agencyId ? true : false;
}

export const isSuperUser = () => {
    const token = sessionStore.getToken();
    if (!token) {
        console.error("Sesión invalida", "Debes iniciar nueva sesión.");
        return false;
    }
    const payload = verifyToken(token);
    return payload.role === 'manager' || payload.role === 'developer';

}