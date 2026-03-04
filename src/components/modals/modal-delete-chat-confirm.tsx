import { useChat } from "@/hooks/use-chat";
import { useNavigate } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/routes";
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
import type { ChatType } from "@/types/chat.type";
import { useState } from "react";

const ModalDeleteChatConfirm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { deleteChat } = useChat();
  const { closeModal, getModalData, isModalOpen } = useModal();
  const { chat } = getModalData("ModalDeleteChatConfirm") as {
    chat: ChatType;
  };

  const handleDeleteChat = async () => {
    try {
      setIsLoading(true);
      await deleteChat(chat._id);
      navigate(PROTECTED_ROUTES.CHAT);
    } catch (error) {
      console.error("Failed to delete chat:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AlertDialog
      open={isModalOpen("ModalDeleteChatConfirm")}
      onOpenChange={() => closeModal("ModalDeleteChatConfirm")}
    >
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
            disabled={isLoading}
          >
            {chat.isGroup ? "Delete Group" : "Delete Chat"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalDeleteChatConfirm;
