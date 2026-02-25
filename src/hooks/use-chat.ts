import { API } from "@/lib/axios-client";
import type { UserType } from "@/types/auth.type";
import type { ChatType, CreateChatType, CreateMessageType, MessageType } from "@/types/chat.type";
import { toast } from "sonner";
import { create } from "zustand";
import { useAuth } from "./use-auth";
import { generateUUID } from "@/lib/helper";

interface ChatState {
   chats: ChatType[];
   users: UserType[];
   singleChat: {
      chat: ChatType
      messages: MessageType[];
   } | null;
   readMessages: Record<string, string>; // chatId -> lastReadMessageId

   isChatsLoading: boolean;
   isUsersLoading: boolean;
   isCreatingChat: boolean;
   isSingleChatLoading: boolean;
   isSendingMsg: boolean;
   isLoadingMore: boolean;
   hasMoreChats: boolean;


   fetchAllUsers: () => void;
   fetchChats: () => void;
   fetchMoreChats: () => Promise<void>;
   createChat: (payload: CreateChatType) => Promise<ChatType | null>;
   fetchSingleChat: (chatId: string) => void;
   sendMessage: (payload: CreateMessageType) => void;

   updateGroupImage: (chatId: string, image: string) => Promise<void>;
   updateGroupName: (chatId: string, groupName: string) => Promise<void>;
   deleteGroupImage: (chatId: string) => Promise<void>;
   deleteGroupName: (chatId: string) => Promise<void>;
   deleteChat: (chatId: string) => Promise<void>;
   deleteMessage: (messageId: string, chatId: string) => Promise<void>;
   clearChatMessages: (chatId: string) => Promise<void>;
   editMessage: (messageId: string, content: string) => Promise<void>;

   addNewChat: (chat: ChatType) => void;
   updateChatLastMessage: (chatId: string, lastMessage: MessageType) => void;
   addNewMessage: (chatId: string, message: MessageType) => void;
   markChatAsRead: (chatId: string, messageId: string) => void;
   isMessageUnread: (chatId: string, message: MessageType | null, currentUserId: string | null) => boolean;
   updateChatInList: (chat: ChatType) => void;
   removeChatFromList: (chatId: string) => void;
   removeMessageFromChat: (chatId: string, messageId: string) => void;
   clearMessagesInChat: (chatId: string) => void;
   updateMessageInChat: (chatId: string, updatedMessage: MessageType) => void;
}

export const useChat = create<ChatState>()((set, get) => ({
   chats: [],
   users: [],
   singleChat: null,
   readMessages: {},

   isChatsLoading: false,
   isUsersLoading: false,
   isCreatingChat: false,
   isSingleChatLoading: false,
   isSendingMsg: false,
   isLoadingMore: false,
   hasMoreChats: true,
   fetchAllUsers: async () => {
      set({ isUsersLoading: true });
      try {
         const response = await API.get("/user/all");
         set({ users: response.data.users });
      } catch (error: any) {
         console.error("Failed to fetch users:", error);
         toast.error(error?.response?.data?.message || "Failed to fetch users");
      } finally {
         set({ isUsersLoading: false });
      }
   },

   fetchChats: async () => {
      set({ isChatsLoading: true });
      try {
         const response = await API.get("/chat/all", {
            params: { limit: 5, offset: 0 }
         });
         set({
            chats: response.data.chats,
            hasMoreChats: response.data.hasMore
         });
      } catch (error: any) {
         console.error("Failed to fetch chats:", error);
         toast.error(error?.response?.data?.message || "Failed to fetch chats");
      }
      finally {
         set({ isChatsLoading: false });
      }
   },

   fetchMoreChats: async () => {
      const state = get();
      if (state.isLoadingMore || !state.hasMoreChats) return;

      set({ isLoadingMore: true });
      try {
         const currentOffset = state.chats.length;
         const response = await API.get("/chat/all", {
            params: { limit: 20, offset: currentOffset }
         });

         set({
            chats: [...state.chats, ...response.data.chats],
            hasMoreChats: response.data.hasMore,
            isLoadingMore: false
         });
      } catch (error: any) {
         console.error("Failed to fetch more chats:", error);
         toast.error(error?.response?.data?.message || "Failed to load more chats");
         set({ isLoadingMore: false });
      }
   },


   createChat: async (payload: CreateChatType) => {
      set({ isCreatingChat: true });
      try {
         const response = await API.post("/chat/create", {
            ...payload,
         });
         get().addNewChat(response.data.chat);
         toast.success("Chat created successfully");
         return response.data.chat;
      } catch (error: any) {
         console.error("Failed to create chat:", error);
         toast.error(error?.response?.data?.message || "Failed to create chat");
         return null;
      }
      finally {
         set({ isCreatingChat: false });
      }
   },


   fetchSingleChat: async (chatId: string) => {
      set({ isSingleChatLoading: true });
      try {
         const { data } = await API.get(`/chat/${chatId}`);
         set({ singleChat: data })
      } catch (error) {
         console.error("Failed to fetch single chat:", error);
         toast.error("Failed to fetch chat");
      } finally {
         set({ isSingleChatLoading: false });
      }
   },

   sendMessage: async (payload: CreateMessageType) => {
      set({ isSendingMsg: true });
      const { chatId, replyTo, content, image } = payload;
      const { user } = useAuth.getState();

      if (!chatId || !user?._id) return;
      const tempMsgId = generateUUID();

      const tempMessage: MessageType = {
         _id: tempMsgId,
         chatId,
         sender: user as UserType,
         content: content || null,
         image: image || null,
         replyTo: replyTo || null,
         createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString(),
         status: "sending..."
      };

      set((state) => {
         if (state.singleChat?.chat?._id !== chatId) return state;
         return {
            singleChat: {
               ...state.singleChat,
               messages: [...state.singleChat.messages, tempMessage],
            },
         };
      });

      try {
         const { data } = await API.post("/chat/message/send", {
            chatId,
            content,
            image,
            replyToId: replyTo?._id,
         });
         const { userMessage } = data;
         //replace the temp user message
         set((state) => {
            if (!state.singleChat) return state;
            return {
               singleChat: {
                  ...state.singleChat,
                  messages: state.singleChat.messages.map((msg) =>
                     msg._id === tempMsgId ? userMessage : msg
                  ),
               },
            };
         });
      } catch (error: any) {
         toast.error(error?.response?.data?.message || "Failed to send message");
         // Remove failed message
         set((state) => {
            if (!state.singleChat) return state;
            return {
               singleChat: {
                  ...state.singleChat,
                  messages: state.singleChat.messages.filter((msg) => msg._id !== tempMsgId),
               },
            };
         });
      } finally {
         set({ isSendingMsg: false });
      }

   },

   addNewChat: async (newChat: ChatType) => {
      set((state) => {
         const existingChatIndex = state.chats.findIndex((c) => c._id === newChat._id);

         if (existingChatIndex !== -1) {
            //move the chat to the top
            return {
               chats: [newChat, ...state.chats.filter((c) => c._id !== newChat._id)]
            }
         } else {
            return {
               chats: [newChat, ...state.chats]
            }
         }
      })
   },

   updateChatLastMessage: (chatId: string, lastMessage: MessageType) => {
      set((state) => {
         const chat = state.chats.find((c) => c._id === chatId);

         if (!chat) return state;

         return {
            chats: [
               { ...chat, lastMessage },
               ...state.chats.filter((c) => c._id !== chatId)
            ]
         }
      })
   },
   addNewMessage: (chatId: string, message: MessageType) => {
      set((state) => {
         if (!state.singleChat) {
            console.log("No active chat to add message to");
            return state;
         }

         if (state.singleChat.chat._id !== chatId) {
            console.log("Message chatId doesn't match current chat", {
               messageChatId: chatId,
               currentChatId: state.singleChat.chat._id
            });
            return state;
         }


         const messageExists = state.singleChat.messages.some(m => m._id === message._id);
         if (messageExists) {
            console.log("Message already exists, skipping");
            return state;
         }

         console.log("Adding new message to chat:", message);
         return {
            singleChat: {
               ...state.singleChat,
               messages: [...state.singleChat.messages, message]
            }
         };
      });
   },

   markChatAsRead: (chatId: string, messageId: string) => {
      set((state) => ({
         readMessages: {
            ...state.readMessages,
            [chatId]: messageId
         }
      }));
   },

   isMessageUnread: (chatId: string, message: MessageType | null, currentUserId: string | null) => {
      if (!message || !currentUserId) return false;
      const state = get();
      const lastReadMessageId = state.readMessages[chatId];
      return message.sender?._id !== currentUserId && message._id !== lastReadMessageId;
   },

   updateGroupImage: async (chatId: string, image: string) => {
      try {
         const { data } = await API.put("/chat/group/image", { chatId, image });
         get().updateChatInList(data.chat);
         toast.success("Group image updated successfully");
      } catch (error: any) {
         console.error("Failed to update group image:", error);
         toast.error(error?.response?.data?.message || "Failed to update group image");
      }
   },

   updateGroupName: async (chatId: string, groupName: string) => {
      try {
         const { data } = await API.put("/chat/group/name", { chatId, groupName });
         get().updateChatInList(data.chat);
         toast.success("Group name updated successfully");
      } catch (error: any) {
         console.error("Failed to update group name:", error);
         toast.error(error?.response?.data?.message || "Failed to update group name");
      }
   },

   deleteGroupImage: async (chatId: string) => {
      try {
         const { data } = await API.delete("/chat/group/image", { data: { chatId } });
         get().updateChatInList(data.chat);
         toast.success("Group image deleted successfully");
      } catch (error: any) {
         console.error("Failed to delete group image:", error);
         toast.error(error?.response?.data?.message || "Failed to delete group image");
      }
   },

   deleteGroupName: async (chatId: string) => {
      try {
         const { data } = await API.delete("/chat/group/name", { data: { chatId } });
         get().updateChatInList(data.chat);
         toast.success("Group name deleted successfully");
      } catch (error: any) {
         console.error("Failed to delete group name:", error);
         toast.error(error?.response?.data?.message || "Failed to delete group name");
      }
   },

   deleteChat: async (chatId: string) => {
      try {
         await API.delete("/chat/delete", { data: { chatId } });
         get().removeChatFromList(chatId);
         toast.success("Chat deleted successfully");
      } catch (error: any) {
         console.error("Failed to delete chat:", error);
         toast.error(error?.response?.data?.message || "Failed to delete chat");
      }
   },

   deleteMessage: async (messageId: string, chatId: string) => {
      try {
         await API.delete(`/chat/message/${messageId}`);
         get().removeMessageFromChat(chatId, messageId);
         toast.success("Message deleted successfully");
      } catch (error: any) {
         console.error("Failed to delete message:", error);
         toast.error(error?.response?.data?.message || "Failed to delete message");
      }
   },

   clearChatMessages: async (chatId: string) => {
      try {
         await API.delete("/chat/messages/clear", { data: { chatId } });
         get().clearMessagesInChat(chatId);
         toast.success("Chat messages cleared successfully");
      } catch (error: any) {
         console.error("Failed to clear chat messages:", error);
         toast.error(error?.response?.data?.message || "Failed to clear chat messages");
      }
   },
   editMessage: async (messageId: string, content: string) => {
      try {
         const { data } = await API.put("/chat/message/edit", { messageId, content });
         get().updateMessageInChat(data.editedMessage.chatId, data.editedMessage);
         toast.success("Message edited successfully");
      } catch (error: any) {
         console.error("Failed to edit message:", error);
         toast.error(error?.response?.data?.message || "Failed to edit message");
      }
   },


   updateChatInList: (updatedChat: ChatType) => {
      set((state) => ({
         chats: state.chats.map((chat) =>
            chat._id === updatedChat._id ? updatedChat : chat
         ),
         singleChat: state.singleChat?.chat._id === updatedChat._id
            ? { ...state.singleChat, chat: updatedChat }
            : state.singleChat
      }));
   },

   removeChatFromList: (chatId: string) => {
      set((state) => ({
         chats: state.chats.filter((chat) => chat._id !== chatId),
         singleChat: state.singleChat?.chat._id === chatId ? null : state.singleChat
      }));
   },

   removeMessageFromChat: (chatId: string, messageId: string) => {
      set((state) => {
         if (!state.singleChat || state.singleChat.chat._id !== chatId) {
            return state;
         }
         return {
            singleChat: {
               ...state.singleChat,
               messages: state.singleChat.messages.filter((msg) => msg._id !== messageId)
            }
         };
      });
   },

   clearMessagesInChat: (chatId: string) => {
      set((state) => {
         if (!state.singleChat || state.singleChat.chat._id !== chatId) {
            return state;
         }
         return {
            singleChat: {
               ...state.singleChat,
               messages: []
            }
         };
      });
   },

   updateMessageInChat: (chatId: string, updatedMessage: MessageType) => {
      set((state) => {
         if (!state.singleChat || state.singleChat.chat._id !== chatId) {
            return state;
         }
         return {
            singleChat: {
               ...state.singleChat,
               messages: state.singleChat.messages.map((msg) =>
                  msg._id === updatedMessage._id ? updatedMessage : msg
               )
            }
         };
      });
   }

}));