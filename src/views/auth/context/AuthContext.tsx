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
    handleRegisterUser: (user: UserRegister) => Promise<void>
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

    const handleRegisterUser = async (user: UserRegister) => {
        const { name, password, phone, role, userName, status, confirmPassword } = user

        // Validaciones
        if (!name || !userName || !password || !confirmPassword || !phone || !role) {
            toast.error("Por favor completa todos los campos", {
                richColors: true,
                duration: 10_000,
                position: 'top-center'
            })
            setLoading(false)
            return
        }

        if (name.length < 8) {
            toast.error("El nombre del usuario es muy corto", {
                richColors: true,
                duration: 10_000,
                position: 'top-center'
            })
            setLoading(false)
            return
        }
        if (password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden", {
                richColors: true,
                duration: 10_000,
                position: 'top-center'
            })
            setLoading(false)
            return
        }

        if (password.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres', {
                richColors: true,
                duration: 10_000,
                position: 'top-center'
            })
            // toast.error("La contraseña debe tener al menos 6 caracteres")
            setLoading(false)
            return
        }

        if (phone.length < 10) {
            toast.error("El número de teléfono debe tener al menos 10 dígitos",{
                richColors: true,
                duration: 10_000,
                position: 'top-center'
            })
            setLoading(false)
            return
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
    
                toast.success('Registro exitoso.',{
                    description:' La cuenta ha sido creada correctamente',
                    richColors: true,
                    duration: 20_000,
                    position: 'top-center'
                })
    
    
            }
    
            if (resp.error) {
                // setError(`${resp.error.message} ${resp.error.detail}`)
                toast.warning(resp.error.message, {
                    description: resp.error.detail,
    
                    duration: 10_000,
                    position: 'top-center'
                })
            }
            
        } finally{
            setLoading(false)
        }

    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            setLoading,
            login,
            logout,
            handleRegisterUser
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