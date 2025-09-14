import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService } from '@/lib/api';
import { AuthState, User } from '@/types/auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,

      initialize: () => {
        const token = apiService.getToken();
        const user = apiService.getUser();

        if (token && user) {
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await apiService.login({ email, password });
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      loginWithGoogle: async (user: User, token: string) => {
        set({ isLoading: true });
        try {

          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(user));

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });

        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await apiService.register({ name, email, password });
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        apiService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      // Only persist user and token, not loading states
      partialize: (state) => ({
        user: state.user,
        token: state.token
      }),
    }
  )
); 