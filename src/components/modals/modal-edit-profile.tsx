import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AvatarWithBadge from "../avatar-with-badge";
import { useModal } from "@/hooks/use-modal";
import type { UserProfile } from "@/types/profile.type";
import { Button } from "../ui/button";
import { Camera, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useProfile } from "@/hooks/use-profile";
import { Textarea } from "../ui/textarea";

const ModalEditProfile = () => {
  const { isModalOpen, closeModal, getModalData } = useModal();

  const { isUpdating, updateProfile } = useProfile();
  const profileData = getModalData("ModalEditProfile") as {
    profile: UserProfile;
  };

  // Check if profileData and profile exist
  if (!profileData?.profile?.user) {
    return null;
  }

  const { user } = profileData.profile;
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

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
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
    const data: { name: string; username?: string; bio: string; avatar?: string } = {
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
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setName(user.name);
    setUsername(user.username || "");
    setBio(user.bio || "");
    setAvatarPreview(user.avatar || null);
    setAvatarBase64(null);
    closeModal("ModalEditProfile");
  };

  const isFormChanged =
    name.trim() !== user.name ||
    username.trim() !== (user.username || "") ||
    bio.trim() !== (user.bio || "") ||
    avatarBase64 !== null;

  return (
    <>
      <Dialog
        open={isModalOpen("ModalEditProfile")}
        onOpenChange={() => closeModal("ModalEditProfile")}
      >
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <AvatarWithBadge
                imageUrl={avatarPreview || ""}
                className="h-15 w-15"
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

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormChanged || !name.trim() || isUpdating}
            >
              {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

export default ModalEditProfile;
