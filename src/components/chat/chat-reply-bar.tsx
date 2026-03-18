import type { MessageType } from "@/types/chat.type";
import { Button } from "../ui/button";
import { Image as ImageIcon, X } from "lucide-react";
import type React from "react";

interface ChatReplyBarProps {
  replyTo: MessageType | null;
  currentUserId: string | null;
  onCancel: () => void;
}
const ChatReplyBar: React.FC<ChatReplyBarProps> = ({
  replyTo,
  currentUserId,
  onCancel,
}) => {
  if (!replyTo) return null;

  const senderName =
    replyTo.sender?._id === currentUserId ? "You" : replyTo.sender?.name;

  return (
    <div className="absolute bottom-20 inset-x-0 px-6 animate-in slide-in-from-bottom-2">
      <div className="mx-auto max-w-4xl border-x border-t border-border/50 bg-background/96 backdrop-blur-sm rounded-t-2xl">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="min-w-0 flex-1 border-l-2 border-l-primary pl-2.5">
            <h5 className="mb-0.5 text-[11px] font-semibold text-primary">
              Replying to {senderName}
            </h5>
            {replyTo?.image ? (
              <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <ImageIcon size={12} />
                <span>Photo</span>
              </div>
            ) : (
              <p className="truncate text-[13px] text-muted-foreground">
                {replyTo.content}
              </p>
            )}
          </div>

          {replyTo?.image && (
            <img
              src={replyTo.image}
              alt=""
              className="h-8 w-8 rounded-md object-cover"
            />
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="h-7 w-7 shrink-0 rounded-full hover:bg-muted"
          >
            <X size={16} strokeWidth={2} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatReplyBar;
