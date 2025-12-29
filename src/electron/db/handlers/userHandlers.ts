import { ipcMain } from "electron";
import { userRepo } from "../repositories/userRepo.js";
import { comparePassword, hashPassword } from "../../security/pass.js";
import { AppError, AuthError, RegisterUserError, ValidationError } from '../../../shared/errors/customError.js'
import { generateUniqueUserName, getAppMetadata } from "../../utils/helpers.js";
import { sessionStore } from "../../security/store-sesion.js";
import { signToken, verifyToken } from "../../security/jwt.js";
import jwt from "jsonwebtoken";


const { JsonWebTokenError, TokenExpiredError } = jwt;


export function registerUserHandlers() {
    ipcMain.handle("getById", async (_event, id: User['id']) => userRepo.getById(id));
    ipcMain.handle("getByUserName", async (_event, userName: User['userName']): Promise<ResponseElectronUser> => {

        try {
            console.log('inicia process auth');
            if (!userName) throw new ValidationError("Falta de datos.", "Ingresa el userName")

            const user = await userRepo.getByName(userName)
            console.log('this is user', user);
            if (!user) throw new AuthError("Usuario no encontrado.", "valida tu información ingresada.")

            const { password, ...rest } = user;
            return { ok: true, data: rest, error: null };


        } catch (error) {
            //logger
            console.log(error);
            if (error instanceof AppError) {
                return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };
            }

            return { ok: false, data: null, error: { message: "Error interno", detail: "error no esperado" } };
        }


    });
    ipcMain.handle("getUsers", () => userRepo.getAll());

    ipcMain.handle("addUser", async (_event, user: User): Promise<ResponseElectronUser> => {

        try {

            if (!user.password || !user.phone || !user.role || !user.name || !user.status || !user.userName)
                throw new RegisterUserError("Ingresa la informacion completa.", "Faltan datos para poder realizar el registro del usuario.");

            user.password = await hashPassword(user.password);
            const result: User = await userRepo.add(user);
            if (!result) throw new RegisterUserError("Error al crear usuario", "jsjs");
            const { password, ...rest } = result;
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
    ipcMain.handle("updateUser", async (_event, user: User): Promise<ResponseElectronGeneric> => {
        try {
            if (!user.password) throw new ValidationError('Falta de datos', 'El password a actualizar es obligatorio');
            user.password = await hashPassword(user.password);
            user.status = 'active';

            const userUpdate = await userRepo.update({
                name: user.name,
                userName: user.userName,
                phone: user.phone,
                status: 'active',
                role: user.role,
                password: user.password,
                id: user.id
            });

            sessionStore.clear(); //limpia session
            return { ok: true, error: null, data: userUpdate }


        } catch (error) {
            if (error instanceof AppError) {
                return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };
            }

            return { ok: false, data: null, error: { message: "Error inesperado", detail: "no fue posible actualizar la cotraseña" } };

        }

    });
    ipcMain.handle("deleteUser", (_event, id) => userRepo.delete(id));
    ipcMain.handle("authUser", async (_event, credentials: UserCredentials): Promise<ResponseElectronUser> => {

        try {
            console.log('inicia process auth');

            const user = await userRepo.authUser(credentials)
            console.log('this is user', user);

            if (!user) throw new AuthError("Usuario no encontrado.", "valida tu información ingresada.")

            const passworValidate = await comparePassword(credentials.password, user.password)
            console.log('passworValidate', passworValidate);

            if (!passworValidate) throw new AuthError("Contraseña incorrecta", "valida tu información ingresada.")

            const { password, ...rest } = user;
            const token = signToken(rest);
            sessionStore.setToken(token);
            return { ok: true, data: rest, error: null };


        } catch (error) {
            //logger
            console.log(error);
            if (error instanceof AppError) {
                return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };
            }

            return { ok: false, data: null, error: { message: "Error interno", detail: "error no esperado" } };
        }


    });
    ipcMain.handle("logout", async (_event, credentials: UserCredentials): Promise<ResponseElectronGeneric> => {

        try {
            console.log('inicia process logout');
            sessionStore.clear();
            return { ok: true, data: "logut exitoso", error: null };

        } catch (error) {
            //logger
            console.log(error);
            if (error instanceof AppError) {
                return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };
            }

            return { ok: false, data: null, error: { message: "Error interno", detail: "error no esperado" } };
        }


    });

    ipcMain.handle("checkSession", async (): Promise<ResponseElectronUser> => {
        console.log('process validation session');

        try {
            const token = sessionStore.getToken();
            if (!token) throw new AuthError("Sesión invalida", "Debes iniciar nueva sesión.");
            const payload = verifyToken(token);
            console.log('este es el mugroso payload', payload);
            if (!payload.id || !payload.name || !payload.phone || !payload.role || !payload.status || !payload.userName) throw new AuthError("Sesión invalida", "Debes iniciar nueva sesión.");
            return { ok: true, data: payload, error: null }
        } catch (error) {

            sessionStore.clear();
            if (error instanceof AppError) return { ok: false, data: null, error: { message: error.message, detail: error.details || '' } };
            if (error instanceof TokenExpiredError) return { ok: false, data: null, error: { message: "Sesión expirada", detail: "Tu sesión ha expirado. Inicia sesión nuevamente." } };
            if (error instanceof JsonWebTokenError) return { ok: false, data: null, error: { message: "Sesión inválida", detail: "Token inválido. Inicia sesión nuevamente." } };

            console.log('error in check sesion', error);
            return { ok: false, data: null, error: { message: "Error interno", detail: "error no esperado" } };
        }
    });

    ipcMain.handle("generateUniqueUserName", async (_event, userName: User['userName']): Promise<ResponseElectronGeneric> => {

        try {
            console.log('start process validacion nombre user');
            const userNameAllow = await generateUniqueUserName(userName);

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
