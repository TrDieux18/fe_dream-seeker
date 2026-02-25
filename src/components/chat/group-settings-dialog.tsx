import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/use-chat";
import type { ChatType } from "@/types/chat.type";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Camera, Trash2, Edit2, X } from "lucide-react";
import { toast } from "sonner";

interface GroupSettingsDialogProps {
  chat: ChatType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GroupSettingsDialog = ({
  chat,
  open,
  onOpenChange,
}: GroupSettingsDialogProps) => {
  const {
    updateGroupImage,
    updateGroupName,
    deleteGroupImage,
    deleteGroupName,
    deleteChat,
    clearChatMessages,
  } = useChat();

  const [groupName, setGroupName] = useState(chat.groupName || "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync local state with chat prop changes
  useEffect(() => {
    setGroupName(chat.groupName || "");
    console.log("GroupSettingsDialog - chat updated:", {
      chatId: chat._id,
      groupName: chat.groupName,
      groupImage: chat.groupImage,
    });
  }, [chat.groupName, chat.groupImage, chat._id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        setIsLoading(true);
        await updateGroupImage(chat._id, reader.result as string);
      } catch (error) {
        console.error("Failed to upload image:", error);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = async () => {
    try {
      setIsLoading(true);
      await deleteGroupImage(chat._id);
    } catch (error) {
      console.error("Failed to delete image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (!groupName.trim()) {
      toast.error("Group name cannot be empty");
      return;
    }
    try {
      setIsLoading(true);
      await updateGroupName(chat._id, groupName.trim());
      setIsEditingName(false);
    } catch (error) {
      console.error("Failed to update name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteName = async () => {
    try {
      setIsLoading(true);
      await deleteGroupName(chat._id);
      setGroupName("");
      setIsEditingName(false);
    } catch (error) {
      console.error("Failed to delete name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearMessages = async () => {
    try {
      setIsLoading(true);
      await clearChatMessages(chat._id);
      toast.success("All messages cleared");
      setShowClearConfirm(false);
    } catch (error) {
      console.error("Failed to clear messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = async () => {
    try {
      setIsLoading(true);
      await deleteChat(chat._id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete chat:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
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
                  disabled={isLoading}
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
                    disabled={isLoading}
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
                  disabled={!isEditingName || isLoading}
                  placeholder="Enter group name"
                />
                {isEditingName ? (
                  <>
                    <Button
                      size="icon"
                      onClick={handleUpdateName}
                      disabled={isLoading}
                    >
                      ✓
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setIsEditingName(false);
                        setGroupName(chat.groupName || "");
                      }}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setIsEditingName(true)}
                    disabled={isLoading}
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
                  disabled={isLoading}
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
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={participant.avatar || ""} />
                      <AvatarFallback>
                        {participant.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{participant.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="space-y-2 pt-4 border-t">
              <Label className="text-destructive">Danger Zone</Label>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowClearConfirm(true)}
                  disabled={isLoading}
                  className="w-full justify-start text-orange-600 hover:text-orange-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Messages
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isLoading}
                  className="w-full justify-start text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Group Chat
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
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

      {/* Clear Messages Confirmation */}
      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Messages?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all messages in this chat. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearMessages}
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isLoading ? "Clearing..." : "Clear Messages"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Chat Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group Chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this group chat and all its messages
              for all participants. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteChat}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete Chat"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GroupSettingsDialog;
