export type NotificationType = "like" | "comment" | "follow";

export interface NotificationActor {
   _id?: string;
   username?: string;
   name?: string;
   avatar?: string | null;
}

export interface NotificationPost {
   _id?: string;
   caption?: string;
   images?: string[];
}

export interface NotificationPayload {
   _id?: string;
   type: NotificationType;
   read?: boolean;
   createdAt?: string;
   actor?: NotificationActor;
   post?: NotificationPost;
}

export interface SocketNotificationItem {
   _id: string;
   type: NotificationType;
   read: boolean;
   createdAt: string;
   actor?: NotificationActor;
   post?: NotificationPost;
}
