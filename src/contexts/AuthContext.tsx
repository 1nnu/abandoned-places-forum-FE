import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../auth/AuthService';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Sync state with localStorage
        localStorage.setItem('isAuthenticated', isAuthenticated.toString());
    }, [isAuthenticated]);

    const login = async (username: string, password: string) => {
        try {
            await AuthService.login(username, password);
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            await AuthService.register(username, email, password);
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration failed', error);
        }
    };

    const logout = () => {
        AuthService.logout();
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
