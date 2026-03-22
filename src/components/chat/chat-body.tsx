import { useChat } from "@/hooks/use-chat";
import { useSocket } from "@/hooks/use-socket";
import type { MessageType } from "@/types/chat.type";
import { useEffect, useRef } from "react";
import ChatBodyMessage from "./chat-body-message";
import { shouldShowTimestamp, formatTimestamp } from "@/lib/date-utils";
import { useAuth } from "@/hooks/use-auth";

interface ChatBodyProps {
  chatId: string;
  messages: MessageType[];
  onReply: (message: MessageType) => void;
}

const ChatBody: React.FC<ChatBodyProps> = ({ chatId, messages, onReply }) => {
  const { socket } = useSocket();
  const { user } = useAuth();

  const {
    addNewMessage,
    removeMessageFromChat,
    clearMessagesInChat,
    markChatAsRead,
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
    if (!messages.length || !user?._id) return;

    const lastMessage = messages[messages.length - 1];

    if (lastMessage && lastMessage.sender?._id !== user._id) {
      markChatAsRead(chatId, lastMessage._id);
    }
  }, [messages, chatId, user?._id, markChatAsRead]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-hidden bg-background">
      <div className="h-full overflow-y-auto overscroll-contain">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-1 pt-3 pb-24 sm:pb-28">
          {messages.map((message, index) => {
            const previousMessage = index > 0 ? messages[index - 1] : null;
            const showTimestamp = shouldShowTimestamp(message, previousMessage);
            const hasSameSenderAsPrevious =
              previousMessage?.sender?._id === message.sender?._id;

            return (
              <div key={message._id}>
                {showTimestamp && (
                  <div className="flex justify-center items-center my-2">
                    <span className="text-[11px] text-muted-foreground/70 font-normal px-3 py-1">
                      {formatTimestamp(new Date(message.createdAt))}
                    </span>
                  </div>
                )}
                <ChatBodyMessage
                  message={message}
                  onReply={onReply}
                  showAvatar={!hasSameSenderAsPrevious}
                />
              </div>
            );
          })}
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatBody;
