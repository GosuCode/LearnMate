export interface UserProfile {
    id?: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface NotificationPreferences {
    emailNotifications: boolean;
    quizReminders: boolean;
    newMaterialUpdates: boolean;
    weeklyReports: boolean;
    achievementAlerts: boolean;
}

export interface ProfileSectionProps {
    profile: UserProfile;
    isEditing: boolean;
    editedProfile: UserProfile;
    isSaving: boolean;
    fileInputRef: React.RefObject<HTMLInputElement>;
    handleProfileEdit: () => void;
    handleProfileCancel: () => void;
    handleProfileChange: (field: keyof UserProfile, value: string) => void;
    handleAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    authLoading: boolean;
}

export interface OtherSettingsProps {
    isDarkMode: boolean;
    handleThemeToggle: (checked: boolean) => void;
    notifications: NotificationPreferences;
    handleNotificationChange: (key: keyof NotificationPreferences, checked: boolean) => void;
    handleDataExport: () => void;
    isExporting: boolean;
}