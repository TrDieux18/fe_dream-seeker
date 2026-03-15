import { useEffect, useMemo, useState } from "react";
import FeedLayout from "@/layouts/feed-layout";
import { useSocket } from "@/hooks/use-socket";
import { cn } from "@/lib/utils";
import { getUnreadCount, getVisibleNotifications } from "@/lib/notification";
import NotificationEmptyState from "@/components/notification/notification-empty-state";
import NotificationItem from "@/components/notification/notification-item";
import { useNotification } from "@/hooks/use-notification";

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const { notifications, unreadNotificationCount } = useSocket();
  const {
    fetchNotifications,
    fetchUnreadCount,
    markAllNotificationsAsRead,
    isNotificationsLoading,
  } = useNotification();

  useEffect(() => {
    const initNotifications = async () => {
      await fetchUnreadCount();
      await fetchNotifications();
      await markAllNotificationsAsRead();
    };

    initNotifications();
  }, [fetchNotifications, fetchUnreadCount, markAllNotificationsAsRead]);

  const visibleNotifications = useMemo(() => {
    return getVisibleNotifications(notifications, activeTab);
  }, [activeTab, notifications]);

  const unreadCount = useMemo(() => {
    return getUnreadCount(notifications);
  }, [notifications]);

  return (
    <FeedLayout showRightSidebar={false}>
      <div className="mx-auto w-full max-w-4xl px-4 pb-24 pt-8 md:px-8">
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-background shadow-sm">
          <div className="relative border-b border-border/50  px-6 py-6">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-200/20 blur-2xl" />
            <div className="absolute -bottom-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-cyan-200/20 blur-xl" />

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Activity Inbox
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Real-time interactions from your network.
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-2 text-sm backdrop-blur">
                <span className="font-medium text-foreground">
                  {unreadNotificationCount} new
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-border/50 px-6 py-3">
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm transition-colors",
                activeTab === "all"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("unread")}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm transition-colors",
                activeTab === "unread"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              Unread {unreadCount > 0 ? `(${unreadCount})` : ""}
            </button>
          </div>

          {isNotificationsLoading ? (
            <div className="px-6 py-16 text-center text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : visibleNotifications.length === 0 ? (
            <NotificationEmptyState />
          ) : (
            <div className="divide-y divide-border/50">
              {visibleNotifications.map((item) => (
                <NotificationItem key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </FeedLayout>
  );
};

export default NotificationsPage;
