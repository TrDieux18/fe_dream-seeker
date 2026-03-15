import { io, Socket } from "socket.io-client";
import { create } from "zustand"
import { toast } from "sonner";
import { getNotificationMessage } from "@/lib/notification";
import type {
   NotificationPayload,
   SocketNotificationItem
} from "@/types/notification.type";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface SocketState {
   socket: Socket | null;
   onlineUsers: string[];
   isConnected: boolean;
   unreadNotificationCount: number;
   notifications: SocketNotificationItem[];
   connectSocket: () => void;
   disconnectSocket: () => void;
   isUserOnline: (userId: string) => boolean;
   clearUnreadNotifications: () => void;
}

export const useSocket = create<SocketState>((set, get) => ({
   socket: null,
   onlineUsers: [],
   isConnected: false,
   unreadNotificationCount: 0,
   notifications: [],

   connectSocket: () => {
      const { socket } = get();
      if (socket?.connected) return;

      // Disconnect existing socket if any
      if (socket) {
         socket.disconnect();
      }

      const newSocket = io(BASE_URL, {
         withCredentials: true,
         autoConnect: true,
         reconnection: true,
         reconnectionAttempts: 5,
         reconnectionDelay: 1000,
         timeout: 10000,
      });

      set({ socket: newSocket });

      newSocket.on("connect", () => {
         set({ isConnected: true });
      });

      newSocket.on("disconnect", (_reason) => {
         set({ isConnected: false, onlineUsers: [] });
      });

      newSocket.on("connect_error", (error) => {
         console.error("Socket connection error:", error.message);
         set({ isConnected: false });
      });

      newSocket.on("online:users", (userIds: string[]) => {
         set({ onlineUsers: userIds });
      });

      newSocket.on("notification:new", (payload: NotificationPayload) => {
         toast.success(getNotificationMessage(payload));

         const nextNotification: SocketNotificationItem = {
            _id: payload._id || `local-${Date.now()}`,
            type: payload.type,
            read: false,
            createdAt: payload.createdAt || new Date().toISOString(),
            actor: payload.actor,
            post: payload.post
         };

         set((state) => ({
            unreadNotificationCount: state.unreadNotificationCount + 1,
            notifications: [nextNotification, ...state.notifications].slice(0, 100)
         }));
      });

   },
   disconnectSocket: () => {
      const { socket } = get();

      if (socket) {
         socket.disconnect();
         set({ socket: null, onlineUsers: [], isConnected: false, unreadNotificationCount: 0, notifications: [] });
      }
   },

   isUserOnline: (userId: string) => {
      return get().onlineUsers.includes(userId);
   },

   clearUnreadNotifications: () => {
      set((state) => ({
         unreadNotificationCount: 0,
         notifications: state.notifications.map((item) => ({ ...item, read: true }))
      }));
   }
}))