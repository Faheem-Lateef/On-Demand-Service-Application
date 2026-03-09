import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../lib/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (user: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSession = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('userToken');
                const storedUser = await AsyncStorage.getItem('userData');
                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (e) {
                // ignore parse errors
            } finally {
                setIsLoading(false);
            }
        };
        loadSession();
    }, []);

    const login = async (newUser: User, newToken: string) => {
        await AsyncStorage.setItem('userToken', newToken);
        await AsyncStorage.setItem('userData', JSON.stringify(newUser));
        setUser(newUser);
        setToken(newToken);
    };

    const logout = async () => {
        // Inform the server to clear the stored refresh token hash.
        // Fire-and-forget: local state is always purged regardless of network outcome.
        api.post('/auth/logout').catch(() => { });

        // Atomically remove all session keys from device storage
        await AsyncStorage.multiRemove(['userToken', 'userData', 'refreshToken']);

        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoggedIn: !!token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
