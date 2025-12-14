import { ipcMain } from "electron";
import { userRepo } from "../repositories/userRepo.js";
import { comparePassword, hashPassword } from "../../security/pass.js";
import { AppError, AuthError, RegisterUserError } from '../../../shared/errors/customError.js'
import { generateUniqueUserName } from "../../utils/helpers.js";

export function registerUserHandlers() {
    ipcMain.handle("getById", async (_event, id: User['id']) => userRepo.getById(id));
    ipcMain.handle("getUsers", () => userRepo.getAll());

    ipcMain.handle("addUser", async (_event, user: User): Promise<ResponseElectronUser> => {

        try {

            if (!user.password || !user.phone || !user.role || !user.name || !user.status || !user.userName)
                throw new RegisterUserError("Ingresa la informacion completa.", "Faltan datos para poder realizar el registro del usuario.");


            user.password = await hashPassword(user.password);
            const result: User = await userRepo.add(user);
            console.log(result);

            if (!result) throw new RegisterUserError("Error al crear usuario", "jsjs");

            const { password, ...rest } = result
        
            return { ok: true, data: rest, error: null };

        } catch (error: any) {
            //logger
            console.log(error);
            if (error instanceof AppError) {
                return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };
            }

            if (error?.code === 'SQLITE_CONSTRAINT' && error.message.includes('users.phone')) {
                return {
                    ok: false,
                    data: null,
                    error: {
                        message: 'Teléfono ya registrado',
                        detail: 'El número de teléfono ya está asociado a otro usuario'
                    }
                };
            }



            return { ok: false, data: null, error: { message: "Error interno", detail: "error no esperado" } };

        }

    });
    ipcMain.handle("updateUser", (_event, user) => userRepo.update(user));
    ipcMain.handle("deleteUser", (_event, id) => userRepo.delete(id));
    ipcMain.handle("authUser", async (_event, credentials: UserCredentials): Promise<ResponseElectronUser> => {

        try {
            console.log('inicia process auth');

            const result = await userRepo.authUser(credentials)
            console.log('this is result', result);

            if (!result) throw new AuthError("Usuario no encontrado.", "valida tu información ingresada.")

            const passworValidate = comparePassword(credentials.password, result.password)
            if (!passworValidate) throw new AuthError("Contraseña incorrecta", "valida tu información ingresada.")


            const { password, ...rest } = result;
            return { data: rest, error: null, ok: true }


        } catch (error) {
            //logger
            console.log(error);
            if (error instanceof AppError) {
                return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };
            }

            return { ok: false, data: null, error: { message: "Error interno", detail: "error no esperado" } };
        }


    })
    ipcMain.handle("generateUniqueUserName", async (_event, userName: User['userName']): Promise<ResponseElectronGeneric> => {

        try {
            console.log('start process validacion nombre user');
            const userNameAllow =await generateUniqueUserName(userName);
         

            if (!userNameAllow) throw new RegisterUserError("Usuario no disponible.", "Ocurrio un error al validar si el nombre del usuario esta disponible.");
            return { data: userNameAllow, error: null, ok: true }


        } catch (error) {
            //logger
            console.log(error);
            if (error instanceof AppError) {
                return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };
            }

            return { ok: false, data: null, error: { message: "Error interno", detail: "error no esperado" } };
        }


    })
}
