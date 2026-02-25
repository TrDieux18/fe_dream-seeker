import { useState } from "react";
import { useChat } from "@/hooks/use-chat";
import { useNavigate } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/routes";
import type { ChatType } from "@/types/chat.type";
import { getOtherUserAndGroup } from "@/lib/helper";
import AvatarWithBadge from "../avatar-with-badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Separator } from "../ui/separator";
import { Trash2, MessageSquareOff } from "lucide-react";

interface DirectChatSettingsDialogProps {
  chat: ChatType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string | null;
}

const DirectChatSettingsDialog = ({
  chat,
  open,
  onOpenChange,
  currentUserId,
}: DirectChatSettingsDialogProps) => {
  const navigate = useNavigate();
  const { clearChatMessages, deleteChat } = useChat();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { name, avatar } = getOtherUserAndGroup(chat, currentUserId);

  const handleClearMessages = async () => {
    try {
      await clearChatMessages(chat._id);
      setShowClearConfirm(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to clear messages:", error);
    }
  };

  const handleDeleteChat = async () => {
    try {
      await deleteChat(chat._id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
      navigate(PROTECTED_ROUTES.CHAT);
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chat Settings</DialogTitle>
            <DialogDescription>
              Manage your chat settings with {name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* User Info Section */}
            <div className="flex flex-col items-center gap-3">
              <AvatarWithBadge
                name={name}
                src={avatar}
                size="w-24 h-24"
                className="text-2xl"
              />
              <div className="text-center">
                <h3 className="font-semibold text-lg">{name}</h3>
              </div>
            </div>

            <Separator />

            {/* Danger Zone */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-destructive">
                Danger Zone
              </h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => setShowClearConfirm(true)}
                >
                  <MessageSquareOff className="h-4 w-4 mr-2" />
                  Clear All Messages
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Chat
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clear Messages Confirmation Dialog */}
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearMessages}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear Messages
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Chat Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this chat and all its messages. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteChat}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Chat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DirectChatSettingsDialog;
