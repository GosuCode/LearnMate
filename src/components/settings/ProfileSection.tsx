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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Save, Camera, Loader2 } from "lucide-react";
import { ProfileSectionProps } from "@/types/settings";

const ProfileSection = ({
  profile,
  isEditing,
  editedProfile,
  isSaving,
  fileInputRef,
  authLoading,
  handleProfileEdit,
  handleProfileCancel,
  handleProfileChange,
  handleAvatarUpload,
}: ProfileSectionProps) => {
  return (
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
        {authLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">
              Loading profile...
            </span>
          </div>
        ) : (
          <>
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={isEditing ? editedProfile.avatar : profile.avatar}
                  />
                  <AvatarFallback className="text-2xl capitalize">
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
                      <p className="text-foreground font-medium capitalize">
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
                  <Button onClick={handleProfileEdit} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
