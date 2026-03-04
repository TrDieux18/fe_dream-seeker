import ModalClearMessagesConfirm from "@/components/modals/modal-clear-messages-confirm";
import ModalDeleteChatConfirm from "@/components/modals/modal-delete-chat-confirm";
import ModalDirectChatSettings from "@/components/modals/modal-direct-chat-settings";
import ModalGroupSettings from "@/components/modals/modal-group-settings";
import { useModal } from "@/hooks/use-modal";
import { useEffect, useState } from "react";

const ModalProvider = () => {
  const { isModalOpen } = useModal();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  });

  if (!isMounted) return null;

  return (
    <>
      {isModalOpen("ModalDirectChatSettings") && <ModalDirectChatSettings />}
      {isModalOpen("ModalGroupSettings") && <ModalGroupSettings />}

      {isModalOpen("ModalClearMessagesConfirm") && (
        <ModalClearMessagesConfirm />
      )}
      {isModalOpen("ModalDeleteChatConfirm") && <ModalDeleteChatConfirm />}
    </>
  );
};

export default ModalProvider;
