"use client";

import { useState, useRef, useEffect } from "react";
import GlobalLayout from "@/components/layout/GlobalLayout";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import ProfileSection from "@/components/settings/ProfileSection";
import OtherSettings from "@/components/settings/OtherSettings";
import { UserProfile, NotificationPreferences } from "@/types/settings";

export default function SettingsPage() {
  const { user, isLoading: authLoading } = useAuthStore();

  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || "",
    email: user?.email || "",
    avatar: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    emailNotifications: true,
    quizReminders: true,
    newMaterialUpdates: false,
    weeklyReports: true,
    achievementAlerts: false,
  });

  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null!);

  // Update profile state when user changes
  useEffect(() => {
    if (user) {
      const userProfile: UserProfile = {
        name: user.name,
        email: user.email,
        avatar: "",
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      setProfile(userProfile);
      setEditedProfile(userProfile);
    }
  }, [user]);

  // Update user profile in backend
  const updateUserProfile = async (updatedProfile: UserProfile) => {
    try {
      setIsSaving(true);
      // For now, just update local state since we don't have a profile update endpoint
      // In a real app, you'd call your backend API here
      setProfile(updatedProfile);
      setEditedProfile(updatedProfile);
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileEdit = async () => {
    if (isEditing) {
      // Save changes to backend
      const success = await updateUserProfile(editedProfile);
      if (success) {
        setIsEditing(false);
      }
    } else {
      // Start editing
      setEditedProfile(profile);
      setIsEditing(true);
    }
  };

  const handleProfileCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload this to your server
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditedProfile((prev) => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThemeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    // Toggle dark mode class on document
    if (checked) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleNotificationChange = (
    key: keyof NotificationPreferences,
    checked: boolean
  ) => {
    setNotifications((prev) => ({ ...prev, [key]: checked }));
  };

  const handleDataExport = async () => {
    setIsExporting(true);
    try {
      // In a real app, this would call your API
      // const response = await fetch('/api/export-data');
      // const data = await response.json();

      // For demo purposes, create mock data
      const mockData = {
        profile: profile,
        preferences: notifications,
        studyHistory: {
          subjects: ["Data Structures", "Java Programming", "Web Technology"],
          quizzesTaken: 24,
          totalStudyTime: "156 hours",
        },
        materials: {
          notes: 45,
          videos: 23,
          summaries: 12,
        },
      };

      // Create and download file
      const element = document.createElement("a");
      const file = new Blob([JSON.stringify(mockData, null, 2)], {
        type: "application/json",
      });
      element.href = URL.createObjectURL(file);
      element.download = "learnmate-data.json";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  // Redirect if not authenticated
  if (!user) {
    return (
      <GlobalLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">
              Please log in to access settings
            </p>
          </div>
        </div>
      </GlobalLayout>
    );
  }

  return (
    <GlobalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile, preferences, and account settings
          </p>
        </div>

        {/* Profile Section */}
        <ProfileSection
          profile={profile}
          isEditing={isEditing}
          editedProfile={editedProfile}
          isSaving={isSaving}
          fileInputRef={fileInputRef}
          authLoading={authLoading}
          handleProfileEdit={handleProfileEdit}
          handleProfileCancel={handleProfileCancel}
          handleProfileChange={handleProfileChange}
          handleAvatarUpload={handleAvatarUpload}
        />

        {/* Theme Section */}
        <OtherSettings
          isDarkMode={isDarkMode}
          handleThemeToggle={handleThemeToggle}
          notifications={notifications}
          handleNotificationChange={handleNotificationChange}
          handleDataExport={handleDataExport}
          isExporting={isExporting}
        />
      </div>
    </GlobalLayout>
  );
}
