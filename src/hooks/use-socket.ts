import { io, Socket } from "socket.io-client";
import { create } from "zustand"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface SocketState {
   socket: Socket | null;
   onlineUsers: string[];
   isConnected: boolean;
   connectSocket: () => void;
   disconnectSocket: () => void;
   isUserOnline: (userId: string) => boolean;
}

export const useSocket = create<SocketState>((set, get) => ({
   socket: null,
   onlineUsers: [],
   isConnected: false,

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

      newSocket.on("disconnect", (reason) => {
         set({ isConnected: false, onlineUsers: [] });
      });

      newSocket.on("connect_error", (error) => {
         console.error("Socket connection error:", error.message);
         set({ isConnected: false });
      });

      newSocket.on("online:users", (userIds: string[]) => {
         set({ onlineUsers: userIds });
      });

   },
   disconnectSocket: () => {
      const { socket } = get();

      if (socket) {
         socket.disconnect();
         set({ socket: null, onlineUsers: [], isConnected: false });
      }
   },

   isUserOnline: (userId: string) => {
      return get().onlineUsers.includes(userId);
   },
}))