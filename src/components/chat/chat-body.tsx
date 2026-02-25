import { useChat } from "@/hooks/use-chat";
import { useSocket } from "@/hooks/use-socket";
import type { MessageType } from "@/types/chat.type";
import { useEffect, useRef } from "react";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import ChatBodyMessage from "./chat-body-message";

interface ChatBodyProps {
  chatId: string;
  messages: MessageType[];
  onReply: (message: MessageType) => void;
}

const ChatBody: React.FC<ChatBodyProps> = ({ chatId, messages, onReply }) => {
  const { socket } = useSocket();

  const {
    addNewMessage,
    removeMessageFromChat,
    clearMessagesInChat,
    updateMessageInChat,
  } = useChat();

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!socket || !chatId) return;

    const handleNewMessage = (msg: MessageType) => addNewMessage(chatId, msg);
    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [socket, chatId, addNewMessage]);

  useEffect(() => {
    if (!socket || !chatId) return;

    const handleMessageDeleted = (data: {
      messageId: string;
      chatId: string;
    }) => {
      if (data.chatId === chatId) {
        removeMessageFromChat(chatId, data.messageId);
      }
    };
    socket.on("message:deleted", handleMessageDeleted);

    return () => {
      socket.off("message:deleted", handleMessageDeleted);
    };
  }, [socket, chatId, removeMessageFromChat]);

  useEffect(() => {
    if (!socket || !chatId) return;

    const handleMessageEdited = (data: {
      message: MessageType;
      chatId: string;
    }) => {
      if (data.chatId === chatId) {
        updateMessageInChat(chatId, data.message);
      }
    };
    socket.on("message:edited", handleMessageEdited);

    return () => {
      socket.off("message:edited", handleMessageEdited);
    };
  }, [socket, chatId, updateMessageInChat]);

  useEffect(() => {
    if (!socket || !chatId) return;

    const handleMessagesCleared = (data: { chatId: string }) => {
      if (data.chatId === chatId) {
        clearMessagesInChat(chatId);
      }
    };
    socket.on("chat:messages-cleared", handleMessagesCleared);

    return () => {
      socket.off("chat:messages-cleared", handleMessagesCleared);
    };
  }, [socket, chatId, clearMessagesInChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const shouldShowTimestamp = (
    currentMessage: MessageType,
    previousMessage: MessageType | null,
  ): boolean => {
    if (!previousMessage) return true;

    const currentTime = new Date(currentMessage.createdAt);
    const previousTime = new Date(previousMessage.createdAt);

    return differenceInMinutes(currentTime, previousTime) > 10;
  };

  const formatTimestamp = (date: Date): string => {
    if (isToday(date)) {
      return format(date, "h:mm a");
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, "h:mm a")}`;
    } else {
      return format(date, "MMM d, h:mm a");
    }
  };

  return (
    <div className="flex-1 overflow-hidden bg-background">
      <div className="h-auto max-h-screen overflow-y-auto">
        <div className="w-full max-w-6xl mx-auto h-full flex flex-col px-1 pt-20 pb-3">
          {messages.map((message, index) => {
            const previousMessage = index > 0 ? messages[index - 1] : null;
            const showTimestamp = shouldShowTimestamp(message, previousMessage);

            return (
              <div key={message._id}>
                {showTimestamp && (
                  <div className="flex justify-center items-center my-2">
                    <span className="text-[11px] text-muted-foreground/70 font-normal px-3 py-1">
                      {formatTimestamp(new Date(message.createdAt))}
                    </span>
                  </div>
                )}
                <ChatBodyMessage message={message} onReply={onReply} />
              </div>
            );
          })}
        </div>
        <br />
        <br />
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatBody;
