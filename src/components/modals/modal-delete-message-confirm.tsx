import { useState } from "react";

import { useModal } from "@/hooks/use-modal";
import { useChat } from "@/hooks/use-chat";
import type { MessageType } from "@/types/chat.type";
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

const ModalDeleteMessageConfirm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { deleteMessage } = useChat();
  const { closeModal, getModalData, isModalOpen } = useModal();

  const modalData = getModalData("ModalDeleteMessageConfirm") as
    | { message: MessageType }
    | undefined;

  const message = modalData?.message;

  const handleDelete = async () => {
    if (!message) return;

    try {
      setIsLoading(true);
      await deleteMessage(message._id, message.chatId);
      closeModal("ModalDeleteMessageConfirm");
    } catch (error) {
      console.error("Failed to delete message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!message) return null;

  return (
    <AlertDialog
      open={isModalOpen("ModalDeleteMessageConfirm")}
      onOpenChange={() => closeModal("ModalDeleteMessageConfirm")}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete message?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this message for everyone in the chat.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete message
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalDeleteMessageConfirm;
