import { useChat } from "@/hooks/use-chat";
import type { MessageType } from "@/types/chat.type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Reply, Trash2, Pencil } from "lucide-react";

interface MessageActionsMenuProps {
  message: MessageType;
  onReply: (message: MessageType) => void;
  onEdit: (message: MessageType) => void;
  currentUserId: string | null;
}

const MessageActionsMenu = ({
  message,
  onReply,
  onEdit,
  currentUserId,
}: MessageActionsMenuProps) => {
  const { deleteMessage } = useChat();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteMessage(message._id, message.chatId);
      } catch (error) {
        console.error("Failed to delete message:", error);
      }
    }
  };

  const isSender = message.sender?._id === currentUserId;
  const canEdit = isSender && !message.image; // Can only edit text messages you sent

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onReply(message)}>
          <Reply className="h-4 w-4 mr-2" />
          Reply
        </DropdownMenuItem>
        {canEdit && (
          <DropdownMenuItem onClick={() => onEdit(message)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
        )}
        {isSender && (
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessageActionsMenu;
