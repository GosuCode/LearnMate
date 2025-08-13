"use client";

import { useState, useRef } from "react";
import GlobalLayout from "@/components/layout/GlobalLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Bell,
  Download,
  Save,
  Camera,
  Palette,
  Database,
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

interface NotificationPreferences {
  emailNotifications: boolean;
  quizReminders: boolean;
  newMaterialUpdates: boolean;
  weeklyReports: boolean;
  achievementAlerts: boolean;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    avatar: "/api/placeholder/150/150",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    emailNotifications: true,
    quizReminders: true,
    newMaterialUpdates: false,
    weeklyReports: true,
    achievementAlerts: false,
  });

  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileEdit = () => {
    if (isEditing) {
      // Save changes
      setProfile(editedProfile);
      setIsEditing(false);
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information and profile picture
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={isEditing ? editedProfile.avatar : profile.avatar}
                  />
                  <AvatarFallback className="text-2xl">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                  </Button>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editedProfile.name}
                        onChange={(e) =>
                          handleProfileChange("name", e.target.value)
                        }
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-foreground font-medium">
                        {profile.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) =>
                          handleProfileChange("email", e.target.value)
                        }
                        placeholder="Enter your email"
                      />
                    ) : (
                      <p className="text-foreground font-medium">
                        {profile.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleProfileEdit}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleProfileCancel}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={handleProfileEdit}>
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Theme Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize your app&apos;s appearance and theme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={handleThemeToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose what notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) =>
                  handleNotificationChange("emailNotifications", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="quiz-reminders">Quiz Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded about upcoming quizzes
                </p>
              </div>
              <Switch
                id="quiz-reminders"
                checked={notifications.quizReminders}
                onCheckedChange={(checked) =>
                  handleNotificationChange("quizReminders", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="material-updates">New Material Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Notify when new study materials are added
                </p>
              </div>
              <Switch
                id="material-updates"
                checked={notifications.newMaterialUpdates}
                onCheckedChange={(checked) =>
                  handleNotificationChange("newMaterialUpdates", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="weekly-reports">Weekly Progress Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Receive weekly study progress summaries
                </p>
              </div>
              <Switch
                id="weekly-reports"
                checked={notifications.weeklyReports}
                onCheckedChange={(checked) =>
                  handleNotificationChange("weeklyReports", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="achievement-alerts">Achievement Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Celebrate your learning milestones
                </p>
              </div>
              <Switch
                id="achievement-alerts"
                checked={notifications.achievementAlerts}
                onCheckedChange={(checked) =>
                  handleNotificationChange("achievementAlerts", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Export Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Data Management
            </CardTitle>
            <CardDescription>
              Export your data and manage your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="export-data">Export All Data</Label>
                <p className="text-sm text-muted-foreground">
                  Download all your data as a JSON file
                </p>
              </div>
              <Button
                onClick={handleDataExport}
                disabled={isExporting}
                variant="outline"
              >
                {isExporting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </GlobalLayout>
  );
}
