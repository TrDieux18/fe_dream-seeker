import type React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Search, PenSquare } from "lucide-react";
import { NewChatPopover } from "./new-chat-popover";
import { Button } from "../ui/button";

interface ChatListHeaderProps {
  onSearch?: (query: string) => void;
}

const ChatListHeader: React.FC<ChatListHeaderProps> = ({ onSearch }) => {
  return (
    <div className="border-b border-border/30 bg-background px-5 py-3">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold text-foreground tracking-tight">
          Messages
        </span>
        <NewChatPopover>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-9 w-9 hover:bg-accent"
          >
            <PenSquare className="h-5 w-5" strokeWidth={1.5} />
          </Button>
        </NewChatPopover>
      </div>

      <div>
        <InputGroup className="rounded-lg border-none bg-muted/60 px-3 py-2 shadow-none">
          <InputGroupAddon className="pl-0 text-muted-foreground">
            <Search
              className="text-muted-foreground"
              size={16}
              strokeWidth={2}
            />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search messages"
            className="h-8 rounded-lg border-0 bg-transparent text-[14px] placeholder:text-muted-foreground"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </InputGroup>
      </div>
    </div>
  );
};

export default ChatListHeader;
