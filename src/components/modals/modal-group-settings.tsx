import { useChat } from "@/hooks/use-chat";
import { useModal } from "@/hooks/use-modal";
import type { ChatType } from "@/types/chat.type";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import DangerZone from "../ui/danger-zone";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Camera, Trash2, Edit2, X } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import AvatarWithBadge from "../avatar-with-badge";

const ModalGroupSettings = () => {
  const {
    updateGroupImage,
    updateGroupName,
    deleteGroupImage,
    deleteGroupName,
  } = useChat();

  const { closeModal, isModalOpen, getModalData } = useModal();
  const { chat } = getModalData("ModalGroupSettings") as { chat: ChatType };

  const [groupName, setGroupName] = useState(chat.groupName || "");
  const [isEditingName, setIsEditingName] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await updateGroupImage(chat._id, reader.result as string);
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = async () => {
    try {
      await deleteGroupImage(chat._id);
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  const handleUpdateName = async () => {
    if (!groupName.trim()) {
      toast.error("Group name cannot be empty");
      return;
    }
    try {
      await updateGroupName(chat._id, groupName.trim());
      setIsEditingName(false);
    } catch (error) {
      console.error("Failed to update name:", error);
    }
  };

  const handleDeleteName = async () => {
    try {
      await deleteGroupName(chat._id);
      setGroupName("");
      setIsEditingName(false);
    } catch (error) {
      console.error("Failed to delete name:", error);
    } finally {
    }
  };

  return (
    <>
      <Dialog
        open={isModalOpen("ModalGroupSettings")}
        onOpenChange={() => closeModal("ModalGroupSettings")}
      >
        <DialogContent className="sm:max-w-125 max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Group Settings</DialogTitle>
            <DialogDescription>
              Manage your group's name, image, and settings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4 overflow-y-auto flex-1">
            {/* Group Image Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar
                  className="w-24 h-24"
                  key={chat.groupImage || "no-image"}
                >
                  <AvatarImage src={chat.groupImage || ""} />
                  <AvatarFallback className="text-2xl">
                    {chat.groupName?.charAt(0).toUpperCase() || "G"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                {chat.groupImage && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteImage}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Image
                  </Button>
                )}
              </div>
            </div>

            {/* Group Name Section */}
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <div className="flex gap-2">
                <Input
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  disabled={!isEditingName}
                  placeholder="Enter group name"
                />
                {isEditingName ? (
                  <>
                    <Button size="icon" onClick={handleUpdateName}>
                      ✓
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setIsEditingName(false);
                        setGroupName(chat.groupName || "");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setIsEditingName(true)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {chat.groupName && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteName}
                  className="text-destructive hover:text-destructive"
                >
                  Reset to Default Name
                </Button>
              )}
            </div>

            {/* Participants Section */}
            <div className="space-y-2">
              <Label>Participants ({chat.participants.length})</Label>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {chat.participants.map((participant) => (
                  <div
                    key={participant._id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50"
                  >
                    <AvatarWithBadge
                      className="w-8 h-8"
                      imageUrl={participant.avatar || ""}
                    />
                    <span className="text-sm">{participant.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <DangerZone chat={chat} />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => closeModal("ModalGroupSettings")}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </>
  );
};

export default ModalGroupSettings;
