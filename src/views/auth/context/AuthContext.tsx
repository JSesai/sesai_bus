import { createContext, use, useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { redirect, useNavigate } from "react-router-dom";



type AuthContextType = {
    user: User | null;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>
    login: (user: UserCredentials) => Promise<void>;
    logout: () => void;
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

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            setLoading,
            login,
            logout
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