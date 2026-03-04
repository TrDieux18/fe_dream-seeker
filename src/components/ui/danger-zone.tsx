import { MessageSquareOff, Trash2 } from "lucide-react";
import { Button } from "./button";
import { useModal } from "@/hooks/use-modal";
import type React from "react";
import type { ChatType } from "@/types/chat.type";

interface DangerZoneProps {
  chat: ChatType;
}

const DangerZone: React.FC<DangerZoneProps> = ({ chat }) => {
  const { openModal } = useModal();
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-destructive">Danger Zone</h4>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={() => openModal("ModalClearMessagesConfirm", { chat })}
        >
          <MessageSquareOff className="h-4 w-4 mr-2" />
          Clear All Messages
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={() => openModal("ModalDeleteChatConfirm", { chat })}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {chat.isGroup ? "Delete Group" : "Delete Chat"}
        </Button>
      </div>
    </div>
  );
};

export default DangerZone;
