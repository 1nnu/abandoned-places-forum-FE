import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });
    const [JWToken, setJWToken] = useState("");
    const [userId, setUserId] = useState("");
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [points, setPoints] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('isAuthenticated', isAuthenticated.toString());
        if (isAuthenticated) {
            localStorage.setItem('JWToken', JWToken);
            localStorage.setItem('userId', userId);
            localStorage.setItem('username', username);
            localStorage.setItem('role', role);
            localStorage.setItem('points', points.toString());
        } else {
            localStorage.removeItem('JWToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            localStorage.removeItem('points');
        }
    }, [isAuthenticated, JWToken, userId, username, role, points]);

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

            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('JWToken', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('username', fetchedUsername);
            localStorage.setItem('role', role);
            localStorage.setItem('points', points.toString());

            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            const { token, userId, username: fetchedUsername, role, points } = await AuthService.register(username, email, password);

            setIsAuthenticated(true);

            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            localStorage.removeItem('points');
            localStorage.removeItem('isAuthenticated');

            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('username', fetchedUsername);
            localStorage.setItem('role', role);
            localStorage.setItem('points', points.toString());
            localStorage.setItem('isAuthenticated', 'true');

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
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('JWToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('points');
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
