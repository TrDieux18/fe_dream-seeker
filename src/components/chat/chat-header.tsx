import { getOtherUserAndGroup } from "@/lib/helper";
import { PROTECTED_ROUTES } from "@/routes/routes";
import type { ChatType } from "@/types/chat.type";
import { ArrowLeft, Phone, Video, Info, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AvatarWithBadge from "../avatar-with-badge";
import { Button } from "../ui/button";
import React, { useState } from "react";
import GroupSettingsDialog from "./group-settings-dialog";
import DirectChatSettingsDialog from "./direct-chat-settings-dialog";

interface ChatHeaderProps {
  chat: ChatType;
  currentUserId: string | null;
}
const ChatHeader: React.FC<ChatHeaderProps> = ({ chat, currentUserId }) => {
  const navigate = useNavigate();
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [showDirectChatSettings, setShowDirectChatSettings] = useState(false);

  const { name, subheading, avatar, isOnline, isGroup } = getOtherUserAndGroup(
    chat,
    currentUserId,
  );

  return (
    <>
      <div
        className="sticky top-0
      flex items-center justify-between border-b border-border/30
       px-4 z-50 bg-background/95 backdrop-blur-sm
      "
      >
        <div className="h-16 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full h-9 w-9 -ml-2"
            onClick={() => navigate(PROTECTED_ROUTES.CHAT)}
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2} />
          </Button>
          <AvatarWithBadge
            name={name}
            src={avatar}
            isGroup={isGroup}
            isOnline={isOnline}
            size="w-10 h-10"
            className=""
          />
          <div>
            <h5 className="font-semibold text-[15px]">{name}</h5>
            <p className="text-[13px] text-muted-foreground">
              {isOnline && !isGroup ? "Active now" : subheading}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-9 w-9 hover:bg-muted/60"
          >
            <Phone className="h-5 w-5" strokeWidth={1.5} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-9 w-9 hover:bg-muted/60"
          >
            <Video className="h-5 w-5" strokeWidth={1.5} />
          </Button>
          {isGroup ? (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9 hover:bg-muted/60"
              onClick={() => setShowGroupSettings(true)}
            >
              <Settings className="h-5 w-5" strokeWidth={1.5} />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9 hover:bg-muted/60"
              onClick={() => setShowDirectChatSettings(true)}
            >
              <Info className="h-5 w-5" strokeWidth={1.5} />
            </Button>
          )}
        </div>
      </div>
      {isGroup ? (
        <GroupSettingsDialog
          chat={chat}
          open={showGroupSettings}
          onOpenChange={setShowGroupSettings}
        />
      ) : (
        <DirectChatSettingsDialog
          chat={chat}
          open={showDirectChatSettings}
          onOpenChange={setShowDirectChatSettings}
          currentUserId={currentUserId}
        />
      )}
    </>
  );
};

export default ChatHeader;
