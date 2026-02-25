import { formatChatTime, getOtherUserAndGroup } from "@/lib/helper";
import { cn } from "@/lib/utils";
import type { ChatType } from "@/types/chat.type";
import type React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AvatarWithBadge from "../avatar-with-badge";
import { useChat } from "@/hooks/use-chat";

interface ChatListItemProps {
  chat: ChatType;
  currentUserId: string | null;
  onClick?: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  currentUserId,
  onClick,
}) => {
  const { pathname } = useLocation();
  const { markChatAsRead, isMessageUnread } = useChat();

  const { lastMessage, createdAt } = chat;

  const { name, avatar, isOnline, isGroup } = getOtherUserAndGroup(
    chat,
    currentUserId,
  );

  useEffect(() => {
    if (pathname.includes(chat._id) && lastMessage) {
      markChatAsRead(chat._id, lastMessage._id);
    }
  }, [pathname, chat._id, lastMessage, markChatAsRead]);

  const getLastMessageText = () => {
    if (!lastMessage) {
      return isGroup
        ? chat.createdBy === currentUserId
          ? "You created the group"
          : "You were added"
        : "Send a message";
    }

    if (lastMessage.image) {
      return lastMessage.sender?._id === currentUserId
        ? "You sent an image."
        : "Sent an image.";
    }

    if (isGroup && lastMessage.sender) {
      return `${lastMessage.sender._id === currentUserId ? "You" : lastMessage.sender.name}: ${lastMessage.content}`;
    }

    if (lastMessage.sender?._id === currentUserId) {
      return `You: ${lastMessage.content}`;
    }

    return lastMessage.content;
  };

  const isUnread = isMessageUnread(chat._id, lastMessage, currentUserId);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-all text-left",
        pathname.includes(chat._id) && "bg-muted/60",
      )}
    >
      <AvatarWithBadge
        name={name}
        src={avatar}
        isGroup={isGroup}
        isOnline={isOnline}
        size="w-12 h-12"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h5 className="text-[15px] font-medium truncate">{name}</h5>
          <span className="text-[12px] text-muted-foreground ml-2">
            {formatChatTime(lastMessage?.updatedAt || createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-x-2">
          <span
            className={cn(
              "text-[14px] truncate flex-1",
              isUnread
                ? "font-medium text-foreground"
                : "text-muted-foreground font-normal",
            )}
          >
            {getLastMessageText()}
          </span>
          {isUnread && (
            <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
          )}
        </div>
      </div>
    </button>
  );
};

export default ChatListItem;
