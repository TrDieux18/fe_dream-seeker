import { useChat } from "@/hooks/use-chat";
import { useEffect, useState, useRef, useMemo } from "react";
import { Spinner } from "../ui/spinner";
import ChatListItem from "./chat-list-item";
import { useNavigate } from "react-router-dom";
import ChatListHeader from "./chat-list-header";
import { useSocket } from "@/hooks/use-socket";
import type { ChatType, MessageType } from "@/types/chat.type";
import { useAuth } from "@/hooks/use-auth";
import ChatListSkeleton from "./chat-list-skeleton";

export const ChatList = () => {
  const navigate = useNavigate();
  
  const {
    fetchChats,
    fetchMoreChats,
    chats,
    isChatsLoading,
    isLoadingMore,
    hasMoreChats,
    addNewChat,
    updateChatLastMessage,
    updateChatInList,
    removeChatFromList,
  } = useChat();

  const { socket } = useSocket();

  const { user } = useAuth();

  const currentUserId = user?._id || null;

  const [searchQuery, setSearchQuery] = useState("");

  // Ref for infinite scroll observer
  const observerTarget = useRef<HTMLDivElement>(null);

  const filteredChats = useMemo(() => {
    return (
      chats.filter(
        (chat) =>
          chat.groupName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.participants.some(
            (p) =>
              p._id !== currentUserId &&
              p.name.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      ) || []
    );
  }, [chats, searchQuery, currentUserId]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!observerTarget.current || searchQuery) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreChats &&
          !isLoadingMore &&
          !isChatsLoading
        ) {
          fetchMoreChats();
        }
      },
      { threshold: 1.0 },
    );

    observer.observe(observerTarget.current);

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [
    fetchMoreChats,
    hasMoreChats,
    isLoadingMore,
    isChatsLoading,
    searchQuery,
  ]);

  useEffect(() => {
    if (!socket) return;

    const handleNewChat = (newChat: ChatType) => {
      addNewChat(newChat);
    };
    socket.on("chat:new", handleNewChat);
    return () => {
      socket.off("chat:new", handleNewChat);
    };
  }, [addNewChat, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleChatUpdated = (data: {
      chatId: string;
      lastMessage: MessageType | null;
    }) => {
      updateChatLastMessage(data.chatId, data.lastMessage);
    };
    socket.on("chat:update", handleChatUpdated);
    return () => {
      socket.off("chat:update", handleChatUpdated);
    };
  }, [socket, updateChatLastMessage]);

  useEffect(() => {
    if (!socket) return;

    const handleGroupUpdated = (updatedChat: ChatType) => {
      updateChatInList(updatedChat);
    };
    socket.on("chat:group-updated", handleGroupUpdated);
    return () => {
      socket.off("chat:group-updated", handleGroupUpdated);
    };
  }, [socket, updateChatInList]);

  useEffect(() => {
    if (!socket) return;

    const handleChatDeleted = (data: { chatId: string }) => {
      removeChatFromList(data.chatId);
    };
    socket.on("chat:deleted", handleChatDeleted);
    return () => {
      socket.off("chat:deleted", handleChatDeleted);
    };
  }, [socket, removeChatFromList]);

  const onRoute = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <div
      className="
        fixed 
        inset-y-0 
        left-0
        md:left-16 
        lg:left-60
        w-full
        max-w-full 
        lg:max-w-95.75
        border-r 
        border-border/30
        bg-background
        flex 
        flex-col
        overflow-hidden
      "
    >
      {/* Header - Fixed height */}
      <div className="shrink-0">
        <ChatListHeader onSearch={setSearchQuery} />
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="px-0 pb-4">
          {isChatsLoading ? (
            [...Array(6)].map((_, idx) => <ChatListSkeleton key={idx} />)
          ) : filteredChats.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
              {searchQuery ? "No chats found." : "No chats available."}
            </div>
          ) : (
            <>
              {filteredChats?.map((chat) => (
                <ChatListItem
                  key={chat._id}
                  chat={chat}
                  currentUserId={currentUserId}
                  onClick={() => onRoute(chat._id)}
                />
              ))}

              {!searchQuery && hasMoreChats && (
                <div ref={observerTarget} className="py-4 flex justify-center">
                  {isLoadingMore && <Spinner />}
                </div>
              )}

              {!searchQuery && !hasMoreChats && chats.length > 0 && (
                <div className="py-4 text-center text-xs text-muted-foreground">
                  No more chats to load
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
