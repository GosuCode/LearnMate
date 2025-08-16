import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, User } from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api';

const isBrowser = typeof window !== 'undefined';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (isBrowser) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data && isBrowser) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data!;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    console.log(userData)
    const response = await this.request<AuthResponse>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data && isBrowser) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data!;
  }

  async getProfile(): Promise<User> {
    const response = await this.request<User>('/profile');
    return response.data!;
  }

  logout(): void {
    if (isBrowser) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  getToken(): string | null {
    if (!isBrowser) return null;
    return localStorage.getItem('authToken');
  }

  getUser(): User | null {
    if (!isBrowser) return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    if (!isBrowser) return false;
    return !!this.getToken();
  }
}

export const apiService = new ApiService(); 