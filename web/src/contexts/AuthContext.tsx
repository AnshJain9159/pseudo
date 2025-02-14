import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    user: any | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: false });

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Authentication temporarily disabled
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
} 