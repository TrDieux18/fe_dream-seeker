import { memo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useChat } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import type { MessageType } from "@/types/chat.type";
import AvatarWithBadge from "../avatar-with-badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ReplyIcon, Heart, Check, X } from "lucide-react";
import MessageActionsMenu from "./message-actions-menu";

interface ChatBodyMessageProps {
  message: MessageType;
  onReply: (message: MessageType) => void;
}
const ChatBodyMessage: React.FC<ChatBodyMessageProps> = memo(
  ({ message, onReply }) => {
    const { user } = useAuth();
    const { editMessage } = useChat();
    const [showHeart, setShowHeart] = useState(false);
    const [lastTap, setLastTap] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(message.content || "");

    const userId = user?._id || null;
    const isCurrentUser = message.sender?._id === userId;

    const replySendername =
      message.replyTo?.sender?._id === userId
        ? "You"
        : message.replyTo?.sender?.name;

    const handleDoubleTap = () => {
      const now = Date.now();
      const DOUBLE_TAP_DELAY = 300;

      if (now - lastTap < DOUBLE_TAP_DELAY) {
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 1000);
      }
      setLastTap(now);
    };

    const handleEdit = (msg: MessageType) => {
      setIsEditing(true);
      setEditContent(msg.content || "");
    };

    const handleSaveEdit = async () => {
      if (!editContent.trim()) return;
      try {
        await editMessage(message._id, editContent);
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to edit message:", error);
      }
    };

    const handleCancelEdit = () => {
      setIsEditing(false);
      setEditContent(message.content || "");
    };

    const containerClass = cn(
      "group flex gap-1.5 py-0.5 px-1 relative",
      isCurrentUser && "flex-row-reverse text-left",
    );

    const contentWrapperClass = cn(
      "max-w-[75%] flex flex-col relative",
      isCurrentUser && "items-end",
    );

    const messageClass = cn(
      "px-3 py-2 text-[15px] break-words leading-5 relative",
      isCurrentUser
        ? "bg-primary/90 text-primary-foreground rounded-3xl rounded-tr-md"
        : "bg-muted/80 text-foreground rounded-3xl rounded-tl-md",
    );

    const replyBoxClass = cn(
      "mb-2 px-3 py-2 text-[13px] rounded-2xl border-l-2 !text-left",
      isCurrentUser
        ? "bg-primary/30 border-l-primary-foreground/50"
        : "bg-accent/60 border-l-muted-foreground",
    );

    return (
      <div className={containerClass}>
        {!isCurrentUser && (
          <div className="shrink-0 flex items-start pt-1">
            <AvatarWithBadge
              name={message.sender?.name || "No name"}
              src={message.sender?.avatar || ""}
              size="w-9 h-9"
            />
          </div>
        )}

        <div className={contentWrapperClass}>
          <div
            className={cn(
              "flex items-end gap-1.5",
              isCurrentUser && "flex-row-reverse",
            )}
          >
            <div
              className={messageClass}
              onDoubleClick={handleDoubleTap}
              onTouchEnd={(e) => {
                if (e.touches.length === 0) handleDoubleTap();
              }}
            >
              {/* ReplyToBox */}
              {message.replyTo && (
                <div className={replyBoxClass}>
                  <h5 className="font-semibold text-[12px] mb-0.5">
                    {replySendername}
                  </h5>
                  <p className="font-normal opacity-70 text-[13px] truncate max-w-xs">
                    {message?.replyTo?.content ||
                      (message?.replyTo?.image ? "Photo" : "")}
                  </p>
                </div>
              )}

              {message?.image && (
                <img
                  src={message?.image || ""}
                  alt=""
                  className="rounded-2xl max-w-xs mb-1"
                />
              )}

              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSaveEdit();
                      } else if (e.key === "Escape") {
                        handleCancelEdit();
                      }
                    }}
                    className="flex-1 h-8 text-sm"
                    autoFocus
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={handleSaveEdit}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                message.content && (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )
              )}

              {/* Heart animation on double-tap */}
              {showHeart && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Heart
                    className="w-16 h-16 fill-red-500 text-red-500 animate-ping"
                    strokeWidth={0}
                  />
                </div>
              )}
            </div>

            {/* Reply Icon Button */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onReply(message)}
                className="opacity-0 group-hover:opacity-100
                  transition-opacity rounded-full h-8 w-8 hover:bg-muted/60"
              >
                <ReplyIcon
                  size={16}
                  className={cn(
                    "text-muted-foreground stroke-[1.5]",
                    isCurrentUser && "scale-x-[-1]",
                  )}
                />
              </Button>
              <MessageActionsMenu
                message={message}
                onReply={onReply}
                onEdit={handleEdit}
                currentUserId={userId}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ChatBodyMessage.displayName = "ChatBodyMessage";

export default ChatBodyMessage;
