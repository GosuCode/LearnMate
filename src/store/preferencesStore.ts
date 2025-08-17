import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NotificationPreferences {
    emailNotifications: boolean;
    quizReminders: boolean;
    newMaterialUpdates: boolean;
    weeklyReports: boolean;
    achievementAlerts: boolean;
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    notifications: NotificationPreferences;
    accessibility: {
        fontSize: 'small' | 'medium' | 'large';
        highContrast: boolean;
        reduceMotion: boolean;
    };
    privacy: {
        shareProgress: boolean;
        showOnlineStatus: boolean;
        allowAnalytics: boolean;
    };
}

interface PreferencesState {
    preferences: UserPreferences;
    isLoading: boolean;
    error: string | null;

    // Actions
    setPreferences: (preferences: Partial<UserPreferences>) => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    setNotifications: (notifications: Partial<NotificationPreferences>) => void;
    setAccessibility: (accessibility: Partial<UserPreferences['accessibility']>) => void;
    setPrivacy: (privacy: Partial<UserPreferences['privacy']>) => void;

    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    resetToDefaults: () => void;
}

const defaultPreferences: UserPreferences = {
    theme: 'system',
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notifications: {
        emailNotifications: true,
        quizReminders: true,
        newMaterialUpdates: false,
        weeklyReports: true,
        achievementAlerts: false,
    },
    accessibility: {
        fontSize: 'medium',
        highContrast: false,
        reduceMotion: false,
    },
    privacy: {
        shareProgress: true,
        showOnlineStatus: true,
        allowAnalytics: true,
    },
};

export const usePreferencesStore = create<PreferencesState>()(
    persist(
        (set) => ({
            preferences: defaultPreferences,
            isLoading: false,
            error: null,

            setPreferences: (updates) => set((state) => ({
                preferences: { ...state.preferences, ...updates }
            })),

            setTheme: (theme) => {
                set((state) => ({
                    preferences: { ...state.preferences, theme }
                }));

                // Apply theme to document
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                } else {
                    // System theme - check media query
                    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (isDark) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                }
            },

            setNotifications: (updates) => set((state) => ({
                preferences: {
                    ...state.preferences,
                    notifications: { ...state.preferences.notifications, ...updates }
                }
            })),

            setAccessibility: (updates) => set((state) => ({
                preferences: {
                    ...state.preferences,
                    accessibility: { ...state.preferences.accessibility, ...updates }
                }
            })),

            setPrivacy: (updates) => set((state) => ({
                preferences: {
                    ...state.preferences,
                    privacy: { ...state.preferences.privacy, ...updates }
                }
            })),

            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),

            resetToDefaults: () => set({
                preferences: defaultPreferences,
                error: null
            }),
        }),
        {
            name: 'user-preferences',
            partialize: (state) => ({ preferences: state.preferences }),
        }
    )
);
