import { Heart, MessageCircle, UserPlus } from "lucide-react";
import type { NotificationPayload, NotificationType } from "@/types/notification.type";

export const getNotificationActorName = (payload: { actor?: { username?: string; name?: string } }) => {
   return payload.actor?.username || payload.actor?.name || "Someone";
};

export const getNotificationMessage = (payload: NotificationPayload) => {
   const actorName = getNotificationActorName(payload);

   if (payload.type === "follow") {
      return `${actorName} started following you`;
   }

   if (payload.type === "like") {
      return `${actorName} liked your post`;
   }

   if (payload.type === "comment") {
      return `${actorName} commented on your post`;
   }

   return "You have a new notification";
};

export const getNotificationTypeMeta = (type: NotificationType) => {
   if (type === "like") {
      return {
         icon: Heart,
         iconClass: "text-rose-500",
         bgClass: "bg-rose-500/10",
         label: "liked your post",
      };
   }

   if (type === "comment") {
      return {
         icon: MessageCircle,
         iconClass: "text-sky-500",
         bgClass: "bg-sky-500/10",
         label: "commented on your post",
      };
   }

   return {
      icon: UserPlus,
      iconClass: "text-emerald-500",
      bgClass: "bg-emerald-500/10",
      label: "started following you",
   };
};

export const getUnreadCount = (items: { read: boolean }[]) => {
   return items.filter((item) => !item.read).length;
};

export const getVisibleNotifications = <T extends { read: boolean }>(
   items: T[],
   activeTab: "all" | "unread"
) => {
   if (activeTab === "unread") {
      return items.filter((item) => !item.read);
   }

   return items;
};
