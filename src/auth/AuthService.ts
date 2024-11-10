const apiUrl = import.meta.env.VITE_API_URL;

const AuthService = {
    login: async (username: string, password: string): Promise<void> => {
        const response = await fetch(`${apiUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Failed to login');
        }

        const data = await response.json();
        
        if (data.token) {
            localStorage.setItem('token', data.token);
        } else {
            throw new Error('No token returned from login');
        }
    },

    register: async (username: string, email: string, password: string): Promise<void> => {
        const response = await fetch(`${apiUrl}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to register');
        }

        const data = await response.json();
        
        if (data.token) {
            localStorage.setItem('token', data.token);
        } else {
            throw new Error('No token returned from registration');
        }
    },

    logout: (): void => {
        localStorage.removeItem('token');
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    },

    getToken: (): string | null => {
        return localStorage.getItem('token');
    },

    setAuthHeader: (headers: Record<string, string> = {}): Record<string, string> => {
        const token = AuthService.getToken(); // Directly calling without this

        // Check if token is not null or undefined
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    },

    getUserInfo: async (): Promise<any> => {
        const response = await fetch(`${apiUrl}/api/auth/userinfo`, {
            method: 'GET',
            headers: AuthService.setAuthHeader({
                'Content-Type': 'application/json',
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }

        return await response.json();
    },
};

export default AuthService;
