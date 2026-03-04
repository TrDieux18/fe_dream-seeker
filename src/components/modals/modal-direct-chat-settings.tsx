import { useModal } from "@/hooks/use-modal";
import type { ChatType } from "@/types/chat.type";

import AvatarWithBadge from "../avatar-with-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { getOtherUserAndGroup } from "@/lib/helper";
import DangerZone from "../ui/danger-zone";
import { Button } from "../ui/button";

const ModalDirectChatSettings = () => {
  const { closeModal, getModalData, isModalOpen } = useModal();

  const { chat, currentUserId } = getModalData("ModalDirectChatSettings") as {
    chat: ChatType;
    currentUserId: string | null;
  };

  const { name, avatar } = getOtherUserAndGroup(chat, currentUserId);

  return (
    <Dialog
      open={isModalOpen("ModalDirectChatSettings")}
      onOpenChange={() => closeModal("ModalDirectChatSettings")}
    >
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
  );
};

export default ModalDirectChatSettings;
