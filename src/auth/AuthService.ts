// src/AuthService.ts
const API_URL = 'http://localhost:8080';

const AuthService = {
    login: async (username: string, password: string): Promise<void> => {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Failed to login');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
    },

    register: async (username: string, email: string, password: string): Promise<void> => {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to register');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
    },

    logout: (): void => {
        localStorage.removeItem('token');
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    },
};

export default AuthService;
