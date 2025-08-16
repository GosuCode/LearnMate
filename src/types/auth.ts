export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    name: string;
    password: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    initialize: () => void;
}
