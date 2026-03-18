import { memo, useState } from "react";
import { cn } from "@/lib/utils";
import type { MessageType } from "@/types/chat.type";
import AvatarWithBadge from "../avatar-with-badge";
import { Button } from "../ui/button";
import { ReplyIcon, Heart, Image as ImageIcon } from "lucide-react";
import MessageActionsMenu from "./message-actions-menu";
import { useAuth } from "@/hooks/use-auth";

interface ChatBodyMessageProps {
  message: MessageType;
  onReply: (message: MessageType) => void;
  showAvatar?: boolean;
}
const ChatBodyMessage: React.FC<ChatBodyMessageProps> = memo(
  ({ message, onReply, showAvatar = true }) => {
    const { user } = useAuth();
    const [showHeart, setShowHeart] = useState(false);
    const [lastTap, setLastTap] = useState(0);

    const userId = user?._id || null;
    const isCurrentUser = message.sender?._id === userId;
    const isImageOnly = message.image && !message.content && !message.replyTo;

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

    const containerClass = cn(
      "group flex gap-1.5 py-0.5 px-1 relative",
      isCurrentUser && "flex-row-reverse text-left",
    );

    const contentWrapperClass = cn(
      "max-w-[75%] flex flex-col relative",
      isCurrentUser && "items-end",
    );

    const messageClass = cn(
      "text-[15px] break-words leading-5 relative",
      !isImageOnly && "px-3 py-2",
      !isImageOnly && isCurrentUser
        ? "bg-primary/90 text-primary-foreground rounded-3xl rounded-tr-md"
        : !isImageOnly &&
            "bg-muted/80 text-foreground rounded-3xl rounded-tl-md",
    );

    const replyBoxClass = cn(
      "mb-1.5 w-full rounded-lg px-2.5 py-1.5 text-[12px] leading-4 !text-left",
      isCurrentUser
        ? "border-l-2 border-l-primary-foreground/70 bg-primary-foreground/12 text-primary-foreground"
        : "border-l-2 border-l-primary/70 bg-foreground/5 text-foreground",
    );

    const shouldShowAvatar = !isCurrentUser && showAvatar;

    return (
      <div className={containerClass}>
        {shouldShowAvatar && (
          <div className="shrink-0 flex items-start pt-1">
            <AvatarWithBadge
              name={message.sender?.name || "No name"}
              src={message.sender?.avatar || ""}
              size="w-9 h-9"
            />
          </div>
        )}

        {!isCurrentUser && !shouldShowAvatar && (
          <div className="w-9 shrink-0" />
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
                  <div className="mb-0.5 flex items-center gap-1 text-[11px] font-semibold opacity-90">
                    <span>{replySendername}</span>
                  </div>

                  {message?.replyTo?.image ? (
                    <div className="flex items-center gap-1.5 text-[12px] opacity-85">
                      <ImageIcon size={12} />
                      <span>Photo</span>
                    </div>
                  ) : (
                    <p className="max-w-xs truncate text-[12px] font-normal opacity-85">
                      {message?.replyTo?.content}
                    </p>
                  )}
                </div>
              )}

              {message?.image && (
                <img
                  src={message?.image || ""}
                  alt=""
                  className={cn("rounded-2xl max-w-xs", !isImageOnly && "mb-1")}
                />
              )}

              {message.content && (
                <p className="whitespace-pre-wrap">{message.content}</p>
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
