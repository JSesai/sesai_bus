import { AppError, RegisterUserError } from "../../shared/errors/customError.js";
import { hashPassword } from "../security/pass.js";
import { appConfigRepo } from "./repositories/appConfigRepo.js";
import { userRepo } from "./repositories/userRepo.js";


export async function seedInitialUser(): Promise<ResponseElectronGeneric> {
    try {
        console.log('start process creacion usuario inicial');
        const usersQuantity = await userRepo.countUsers();
        
        if (usersQuantity > 0) return { data: "Ya existe usuario manager", error: null, ok: true };

        const hashedPassword = await hashPassword("admin123");
        const userAdmin: User = {
            name: "Administrador",
            userName: "admin",
            password: hashedPassword,
            phone: "5555555555",
            role: "developer",//todo cambia a manager el role
            status: "registered"
        }

        const createUser: UserSample = await userRepo.add(userAdmin);
        if (!createUser) throw new RegisterUserError("Error al crear usuario", "Intentalo mas tarde");
        return { data: "Usuario manager create success!!", error: null, ok: true };

    } catch (error: any) {
        //logger
        console.log(error);
        if (error instanceof AppError) return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };

        if (error?.code === "SQLITE_CONSTRAINT") return { ok: true, data: "Usuario manager ya existe", error: null };
        return { ok: false, data: null, error: { message: "Error interno", detail: "error no esperado" } };
    }


}



export async function seedAppConfig() {

    try {
        console.log('start process creacion config app inicial');
       
        const config = await appConfigRepo.getConfig();
        if (!config) {
          await appConfigRepo.createDefault();
        }

    } catch (error: any) {
        //logger
        console.log(error);
        if (error instanceof AppError) return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };

        if (error?.code === "SQLITE_CONSTRAINT") return { ok: true, data: "Configuracion table exist", error: null };
        return { ok: false, data: null, error: { message: "Error interno", detail: "error no esperado" } };
    }
    
}
