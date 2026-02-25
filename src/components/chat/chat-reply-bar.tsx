import type { MessageType } from "@/types/chat.type";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface Props {
  replyTo: MessageType | null;
  currentUserId: string | null;
  onCancel: () => void;
}
const ChatReplyBar = ({ replyTo, currentUserId, onCancel }: Props) => {
  if (!replyTo) return null;

  const senderName =
    replyTo.sender?._id === currentUserId ? "yourself" : replyTo.sender?.name;
  return (
    <div
      className="absolute bottom-20 left-4 right-4
    animate-in slide-in-from-bottom-2
    "
    >
      <div
        className="flex items-center justify-between p-3 text-sm
        border-l-2 border-l-primary
        bg-muted/80 backdrop-blur-sm rounded-xl shadow-sm
        "
      >
        <div className="flex-1 min-w-0 mr-2">
          <h5 className="font-medium text-[13px] mb-0.5">
            Replying to {senderName}
          </h5>
          {replyTo?.image ? (
            <div className="flex items-center gap-2">
              <img
                src={replyTo.image}
                alt=""
                className="w-10 h-10 rounded object-cover"
              />
              <span className="text-muted-foreground text-[13px]">Photo</span>
            </div>
          ) : (
            <p
              className="text-muted-foreground text-[13px]
            truncate max-w-md"
            >
              {replyTo.content}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="shrink-0 h-7 w-7 rounded-full hover:bg-muted"
        >
          <X size={16} strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
};

export default ChatReplyBar;
