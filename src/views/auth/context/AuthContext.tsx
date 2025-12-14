import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import type { UserRegister } from "../screens/RegisterUser";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>
  login: (user: UserCredentials) => Promise<void>;
  logout: () => void;
  handleRegisterUser: (user: UserRegister) => Promise<boolean>;
  getUniqueUserName: (name: User['name']) => Promise<User['userName']>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    console.log('ejecuta usefecgt');

    const saved = localStorage.getItem("auth_user");
    if (saved) {
      setUser(JSON.parse(saved));
      navigate("dashboard");
    } else {
      navigate("/auth/register");

    };
    setLoading(false);
  }, []);

  // Login
  const login = async (userData: UserCredentials) => {
    try {
      console.log('haciendo login', userData);
      const validateUser = await window.electron.users.authUser(userData);
      console.log(validateUser);
      localStorage.setItem("auth_user", JSON.stringify(validateUser));
      navigate("dashboard");
    } catch (error) {
      console.log('el error', error);

    }


  }

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  }
  //Registro de usuario
  const handleRegisterUser = async (user: UserRegister): Promise<boolean> => {
    const { name, password, phone, role, userName, status, confirmPassword } = user

    // Validaciones
    if (!name || !userName || !password || !confirmPassword || !phone || !role) {
      toast.error("Por favor completa todos los campos", {
        richColors: true,
        duration: 10_000,
        position: 'top-center'
      })
      setLoading(false)
      return false;
    }

    if (name.length < 8) {
      toast.error("El nombre del usuario es muy corto", {
        richColors: true,
        duration: 10_000,
        position: 'top-center'
      })
      setLoading(false)
      return false;
    }

    if (phone.length < 10) {
      toast.error("El número de teléfono debe tener al menos 10 dígitos", {
        richColors: true,
        duration: 10_000,
        position: 'top-center'
      })
      setLoading(false)
      return false
    }

    try {
      const resp = await window.electron.users.addUser({
        role,
        userName,
        name,
        password,
        phone,
        status
      })

      console.log(resp);
      if (resp.ok) {
        confetti({
          particleCount: 100,
          spread: 120,
          origin: { y: 0.6 }
        });

        toast.success('Registro exitoso.', {
          description: 'La cuenta ha sido creada correctamente',
          richColors: true,
          duration: 20_000,
          position: 'top-center'
        })

        return true;


      }

      if (resp.error) {

        toast.error(resp.error.message, {
          description: resp.error.detail,
          richColors: true,
          duration: 10_000,
          position: 'top-center'
        })

      }

    } catch (e) {
      console.log(e);

    } finally {
      setLoading(false)
    }

    return false;

  }

  //obtiene nombre de usuario unico
  const getUniqueUserName = async (userName: User['userName']): Promise<User['userName']> => {

    const userNameToRegister = await window.electron.users.generateUniqueUserName(userName);
    return userNameToRegister.data;

  }

  //funcion para hacer la creacion de nombre usuario basado en nombre ingresado

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      setLoading,
      login,
      logout,
      handleRegisterUser,
      getUniqueUserName
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