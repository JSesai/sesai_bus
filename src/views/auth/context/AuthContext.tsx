import { createContext, use, useContext, useEffect, useState } from "react";

export type AuthUser = {
    id: number;
    name: string;
    email: string;
    role: string;
};

type AuthContextType = {
    user: AuthUser | null;
    loading: boolean;
    login: (user: AuthUser) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>({ name: 'juan', email: '', id: 2, role: 'admin' });
    const [loading, setLoading] = useState(true);

    // Cargar usuario desde localStorage al iniciar
    useEffect(() => {
        const saved = localStorage.getItem("auth_user");
        if (saved) setUser(JSON.parse(saved));
        setLoading(false);
    }, []);

    // Login
    const login = (userData: AuthUser) => {
        setUser(userData);
        localStorage.setItem("auth_user", JSON.stringify(userData));
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