import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Download, Palette, Database } from "lucide-react";
import { OtherSettingsProps } from "@/types/settings";

const OtherSettings = ({
  isDarkMode,
  handleThemeToggle,
  notifications,
  handleNotificationChange,
  handleDataExport,
  isExporting,
}: OtherSettingsProps) => {
  return (
    <>
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
    </>
  );
};

export default OtherSettings;
