import type React from "react";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import type { UserType } from "@/types/auth.type";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType;
  isUpdating: boolean;
  onSave: (data: { name: string; bio: string; avatar?: string }) => void;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  open,
  onOpenChange,
  user,
  isUpdating,
  onSave,
}) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
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

  const handleSave = () => {
    const data: { name: string; bio: string; avatar?: string } = {
      name: name.trim(),
      bio: bio.trim(),
    };

    if (avatarBase64) {
      data.avatar = avatarBase64;
    }

    onSave(data);
  };

  const handleCancel = () => {
    // Reset form
    setName(user.name);
    setBio(user.bio || "");
    setAvatarPreview(null);
    setAvatarBase64(null);
    onOpenChange(false);
  };

  const isFormChanged =
    name.trim() !== user.name ||
    bio.trim() !== (user.bio || "") ||
    avatarBase64 !== null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <Avatar className="w-24 h-24 border-2 border-border">
                <AvatarImage
                  src={avatarPreview || user.avatar || ""}
                  alt={user.name}
                />
                <AvatarFallback className="text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
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

export default EditProfileDialog;
