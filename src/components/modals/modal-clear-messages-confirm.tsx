import { useModal } from "@/hooks/use-modal";
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
import { useChat } from "@/hooks/use-chat";
import type { ChatType } from "@/types/chat.type";
import { useState } from "react";
const ModalClearMessagesConfirm = () => {
  const { closeModal, getModalData, isModalOpen } = useModal();
  const [isloading, setIsLoading] = useState(false);

  const { clearChatMessages } = useChat();

  const { chat } = getModalData("ModalClearMessagesConfirm") as {
    chat: ChatType;
  };

  const handleClearMessages = async () => {
    try {
      setIsLoading(true);
      await clearChatMessages(chat._id);
      closeModal("ModalClearMessagesConfirm");
    } catch (error) {
      console.error("Failed to clear messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog
      open={isModalOpen("ModalClearMessagesConfirm")}
      onOpenChange={() => closeModal("ModalClearMessagesConfirm")}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear All Messages?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete all messages in this chat. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClearMessages}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isloading}
          >
            Clear Messages
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalClearMessagesConfirm;
