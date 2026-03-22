import { useState, useRef } from "react";

import { useProfile } from "@/hooks/use-profile";
import AvatarWithBadge from "@/components/avatar-with-badge";
import { Button } from "@/components/ui/button";
import { Camera, ChevronRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { updateProfile, isUpdating } = useProfile();
  const { user } = useAuth();
  // Check if profileData and profile exist
  if (!user) {
    return null;
  }

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username || "");
  const [bio, setBio] = useState(user.bio || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatar || null,
  );
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
      setAvatarBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const data: {
      name: string;
      username?: string;
      bio: string;
      avatar?: string;
    } = {
      name: name.trim(),
      bio: bio.trim(),
    };

    if (username && username.trim()) {
      data.username = username.trim();
    }

    if (avatarBase64) {
      data.avatar = avatarBase64;
    }

    try {
      await updateProfile(data);
      navigate("/feed");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const isFormChanged =
    name.trim() !== user.name ||
    username.trim() !== (user.username || "") ||
    avatarBase64 !== null;

  return (
    <>
      <div className="flex min-h-svh items-start justify-center px-4 py-6 sm:items-center sm:py-10">
        <div className="w-full sm:max-w-125 rounded-lg border border-border p-4 sm:p-6 md:p-8">
          <div className="flex flex-col">
            <span className="text-2xl font-semibold">Complete Profile</span>
            <span className="text-sm text-muted-foreground">
              Please provide the following information to complete your profile.
            </span>
          </div>

          <div className="space-y-6 py-4">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <AvatarWithBadge
                imageUrl={avatarPreview || ""}
                className="h-18 w-18"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAvatarClick}
                disabled={isUpdating}
              >
                <Camera className="w-4 h-4 mr-2" />
                Change Avatar
              </Button>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                disabled={isUpdating}
              />
              <p className="text-xs text-muted-foreground">
                {name.length}/50 characters
              </p>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={30}
                disabled={isUpdating}
              />
              <p className="text-xs text-muted-foreground">
                {(username || "").length}/30 characters
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={150}
                rows={4}
                disabled={isUpdating}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {bio.length}/150 characters
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              onClick={handleSave}
              disabled={!isFormChanged || !name.trim() || isUpdating}
              className="w-full sm:w-auto"
            >
              {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/feed")}
              disabled={isUpdating}
              className="w-full sm:w-auto"
            >
              Skip for now <ChevronRight className="w-4 h-4 animate-pulse" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
      />
    </>
  );
};

export default CompleteProfile;
