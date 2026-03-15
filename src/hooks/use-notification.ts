import { API } from "@/lib/axios-client";
import type { SocketNotificationItem } from "@/types/notification.type";
import { toast } from "sonner";
import { create } from "zustand";
import { useSocket } from "./use-socket";

interface NotificationsResponse {
   notifications: SocketNotificationItem[];
   total: number;
}

interface UnreadCountResponse {
   unreadCount: number;
}

interface NotificationState {

   total: number;
   page: number;
   limit: number;
   isNotificationsLoading: boolean;
   isUnreadCountLoading: boolean;
   isMarkingRead: boolean;
   fetchNotifications: (page?: number, limit?: number) => Promise<void>;
   fetchUnreadCount: () => Promise<void>;
   markNotificationAsRead: (notificationId: string) => Promise<void>;
   markAllNotificationsAsRead: () => Promise<void>;
}

const normalizeNotifications = (notifications: SocketNotificationItem[]) => {
   return notifications.map((item) => ({
      ...item,
      createdAt: item.createdAt || new Date().toISOString(),
      read: Boolean(item.read),
   }));
};

export const useNotification = create<NotificationState>()((set) => ({
   total: 0,
   page: 1,
   limit: 10,
   isNotificationsLoading: false,
   isUnreadCountLoading: false,
   isMarkingRead: false,

   fetchNotifications: async (page = 1, limit = 10) => {
      set({ isNotificationsLoading: true });
      try {
         const response = await API.get<NotificationsResponse>("/notification", {
            params: { page, limit },
         });

         const notifications = normalizeNotifications(
            response.data.notifications || []
         );
         const unreadNotificationCount = notifications.filter(
            (item) => !item.read
         ).length;

         useSocket.setState({
            notifications,
            unreadNotificationCount,
         });

         set({
            total: response.data.total || notifications.length,
            page,
            limit,
         });
      } catch (error: any) {
         console.error("Failed to fetch notifications:", error);
         toast.error(
            error?.response?.data?.message || "Failed to load notifications"
         );
      } finally {
         set({ isNotificationsLoading: false });
      }
   },

   fetchUnreadCount: async () => {
      set({ isUnreadCountLoading: true });
      try {
         const response = await API.get<UnreadCountResponse>("/notification/unread-count");
         useSocket.setState({ unreadNotificationCount: response.data.unreadCount || 0 });
      } catch (error: any) {
         console.error("Failed to fetch unread notification count:", error);
      } finally {
         set({ isUnreadCountLoading: false });
      }
   },

   markNotificationAsRead: async (notificationId: string) => {
      set({ isMarkingRead: true });
      try {
         await API.patch(`/notification/${notificationId}/read`);

         useSocket.setState((state) => {
            const nextNotifications = state.notifications.map((item) =>
               item._id === notificationId ? { ...item, read: true } : item
            );

            return {
               notifications: nextNotifications,
               unreadNotificationCount: nextNotifications.filter((item) => !item.read).length
            };
         });
      } catch (error: any) {
         console.error("Failed to mark notification as read:", error);
         toast.error(error?.response?.data?.message || "Failed to mark notification as read");
      } finally {
         set({ isMarkingRead: false });
      }
   },

   markAllNotificationsAsRead: async () => {
      set({ isMarkingRead: true });
      try {
         await API.patch("/notification/read-all");
         useSocket.getState().clearUnreadNotifications();
      } catch (error: any) {
         console.error("Failed to mark all notifications as read:", error);
         toast.error(error?.response?.data?.message || "Failed to mark all notifications as read");
      } finally {
         set({ isMarkingRead: false });
      }
   }
}));
