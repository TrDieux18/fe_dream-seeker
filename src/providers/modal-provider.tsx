import ModalClearMessagesConfirm from "@/components/modals/modal-clear-messages-confirm";
import ModalDeleteChatConfirm from "@/components/modals/modal-delete-chat-confirm";
import ModalDirectChatSettings from "@/components/modals/modal-direct-chat-settings";
import ModalEditProfile from "@/components/modals/modal-edit-profile";
import ModalFollowList from "@/components/modals/modal-follow-list";
import ModalGroupSettings from "@/components/modals/modal-group-settings";
import ModalPost from "@/components/modals/modal-post";
import ModalUserPreview from "@/components/modals/modal-user-preview";
import { useModal } from "@/hooks/use-modal";
import { useEffect, useState } from "react";

const ModalProvider = () => {
  const { isModalOpen } = useModal();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {isModalOpen("ModalDirectChatSettings") && <ModalDirectChatSettings />}
      {isModalOpen("ModalGroupSettings") && <ModalGroupSettings />}
      {isModalOpen("ModalEditProfile") && <ModalEditProfile />}
      {isModalOpen("ModalPost") && <ModalPost />}
      {isModalOpen("ModalUserPreview") && <ModalUserPreview />}
      {isModalOpen("ModalFollowList") && <ModalFollowList />}

      {isModalOpen("ModalClearMessagesConfirm") && (
        <ModalClearMessagesConfirm />
      )}
      {isModalOpen("ModalDeleteChatConfirm") && <ModalDeleteChatConfirm />}
    </>
  );
};

export default ModalProvider;
