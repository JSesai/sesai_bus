import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { AppError, ValidationError } from "../../../shared/errors/customError";
import type { UserForm } from "../screens/RegisterUser";

type AuthContextType = {
  userLogged: UserResponseAuth | null;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>
  login: (user: UserCredentials) => Promise<void>;
  logout: () => Promise<void>;
  getUniqueUserName: (name: User['name']) => Promise<User['userName']>;
  updatePassword: ({ password, comfirmPassword }: { password: string, comfirmPassword: string }) => Promise<boolean>;
  forgotPassword: (userName: User['userName']) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userLogged, setUserLogged] = useState<UserResponseAuth | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //valida sesion
  const validaSesionActiva = async () => {
    try {
      const responseSession = await window.electron.users.checkSession();
      console.log(responseSession);

      if (responseSession.data && responseSession.data.status === 'registered') {
        toast.warning('Acción requerida', {
          description: 'Debes de actualizar tu contraseña',
          richColors: true,
          duration: 10_000,
          position: 'top-center'
        })
        setUserLogged(responseSession.data)
        navigate('/auth/new-password');
        return;
      }

      if (responseSession.ok) {
        setUserLogged(responseSession.data);
        validateSystemConfiguration();
        return;
      }



      navigate("/auth/login");
      // navigate('/auth/register');


    } catch (error) {
      console.log('errorssss', error);
    } finally {

      setLoading(false);
    }
  }

  // Cargar sesion de usuario
  useEffect(() => {
    console.log('valida session activa...');
    validaSesionActiva();
  }, []);

  const systemConfigurationStatus = async (): Promise<AppConfigStatus> => {
    try {
      const validateAppConfig = await window.electron.appConfig.getAppConfig();
      console.log({ validateAppConfig });

      return (!validateAppConfig.data?.initial_setup_completed) ? "incomplete" : "complete"

    } catch (error) {
      console.log('error al obtener el estatus de configuración', error);
      return "incomplete"

    }
  }


  const validateSystemConfiguration = async () => {
    console.log('ejecutando validacion de configuracion del sistema');

    const currentConfiguration = await systemConfigurationStatus();
    console.log({ systemConfigurationStatus });

    currentConfiguration === "complete" ? navigate('/dashboard/ticket-sale') : navigate('/setup');;


  }
  // Login
  const login = async (userData: UserCredentials) => {
    try {
      console.log('haciendo login', userData);
      const validateUser = await window.electron.users.authUser(userData);

      if (validateUser.data && validateUser.data.status === 'registered') {
        toast.warning('Acción requerida', {
          description: 'Debes de actualizar tu contraseña',
          richColors: true,
          duration: 10_000,
          position: 'top-center'
        })
        setUserLogged(validateUser.data)
        navigate('/auth/new-password');
        return;
      }

      if (!validateUser.ok) {
        toast.error(validateUser.error?.message || 'error', {
          description: validateUser.error?.detail,
          richColors: true,
          duration: 10_000,
          position: 'top-center'
        })
        return;
      }

      setUserLogged(validateUser.data);
      validateSystemConfiguration();

    } catch (error) {
      console.log('el error', error);

    }


  }

  // Logout
  const logout = async () => {
    try {
      const resposeLogout = await window.electron.users.logout();
      console.log(resposeLogout);
      if (!resposeLogout.ok) {
        toast.error("Error inesperado", {
          richColors: true,
          description: "No fue posible cerrar sesión",
          duration: 10_000,
          position: 'top-center'
        })
        return;
      }

      setUserLogged(null);
      navigate('/auth/login');

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }

  }

  //obtiene nombre de usuario unico
  const getUniqueUserName = async (userName: User['userName']): Promise<User['userName']> => {

    const userNameToRegister = await window.electron.users.generateUniqueUserName(userName);
    return userNameToRegister.data;

  }

  //actualizacion de contraseña
  const updatePassword = async ({ password, comfirmPassword }: { password: string, comfirmPassword: string }) => {
    try {
      setLoading(true);
      if (password.length < 6) throw new ValidationError("La longitud minima es de 6 caracteres");
      if (!password || !comfirmPassword) throw new ValidationError("Por favor completa todos los campos");
      if (password !== comfirmPassword) throw new ValidationError("Revisa la información", "La contraseña y la comfirmación no son iguales");

      if (!userLogged?.name || !userLogged?.userName || !userLogged?.phone || !userLogged?.role) return false;

      const updateUser = await window.electron.users.updateUser({
        id: Number(userLogged.id),
        name: userLogged?.name,
        password,
        phone: userLogged?.phone,
        role: userLogged?.role,
        status: userLogged?.status,
        userName: userLogged?.userName,
      });



      console.log('updatePassword', updateUser);
      if (!updateUser.ok) throw new ValidationError("Error iesperado", "La contraseña no fue actualizada");

      toast.success("Contraseña actualizada correctamete", {
        richColors: true,
        duration: 10_000,
        position: 'top-center'
      });

      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.6 }
      });
      navigate("/auth/login");
      return true;

    } catch (error) {
      if (error instanceof AppError) {
        toast.error(error.message, {
          richColors: true,
          description: error.details ?? '',
          duration: 10_000,
          position: 'top-center'
        })

        return false;
      }

      console.log(error);
      return false;

    } finally {
      setLoading(false);
    }


  }

  //recupera password
  const forgotPassword = async (userName: User['userName']) => {
    try {
      setLoading(true)
      const getUser = await window.electron.users.getByUserName(userName);
      if (!getUser.ok) {
        toast.error(getUser.error?.message || 'error', {
          description: getUser.error?.detail,
          richColors: true,
          duration: 10_000,
          position: 'top-center'
        })
        return;
      }
      setUserLogged(getUser.data);

      console.log('este es el user por name', getUser);

      navigate('/auth/new-password');

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{
      // user,
      userLogged,
      loading,
      setLoading,
      login,
      logout,
      getUniqueUserName,
      updatePassword,
      forgotPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("No hay context Auth");
  }
  return ctx;
}