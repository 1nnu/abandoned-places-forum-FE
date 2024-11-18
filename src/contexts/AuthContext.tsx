import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../auth/AuthService';

interface AuthContextType {
    isAuthenticated: boolean;
    JWToken: string;
    userId: string;
    username: string;
    role: string;
    points: number;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [JWToken, setJWToken] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [points, setPoints] = useState<number>(0);

    const navigate = useNavigate();

    const login = async (username: string, password: string) => {
        try {
            const response = await AuthService.login(username, password);
            const { token, userId, username: fetchedUsername, role, points } = response;

            setIsAuthenticated(true);
            setJWToken(token);
            setUserId(userId);
            setUsername(fetchedUsername);
            setRole(role);
            setPoints(points);

            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            const { token, userId, username: fetchedUsername, role, points } = await AuthService.register(username, email, password);

            setIsAuthenticated(true);

            setJWToken(token);
            setUserId(userId);
            setUsername(fetchedUsername);
            setRole(role);
            setPoints(points);

            navigate('/dashboard');
        } catch (error) {
            console.error('Registration failed', error);
        }
    };

    const logout = () => {
        AuthService.logout();
        setIsAuthenticated(false);
        setJWToken("");
        setUserId("");
        setUsername("");
        setRole("");
        setPoints(0);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, JWToken, userId, username, role, points, login, register, logout }}>
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
