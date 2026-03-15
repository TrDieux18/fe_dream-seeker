import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import {
  getNotificationActorName,
  getNotificationTypeMeta,
} from "@/lib/notification";
import type { SocketNotificationItem } from "@/types/notification.type";
import AvatarWithBadge from "../avatar-with-badge";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/hooks/use-notification";

interface NotificationItemProps {
  item: SocketNotificationItem;
}

const NotificationItem = ({ item }: NotificationItemProps) => {
  const { markNotificationAsRead } = useNotification();
  const meta = getNotificationTypeMeta(item.type);
  const actorName = getNotificationActorName(item);
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "flex items-start gap-4 px-6 py-4 transition-colors group",
        item.read ? "bg-background" : "bg-red-50",
      )}
      onClick={() => !item.read && markNotificationAsRead(item._id)}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ",
          meta.bgClass,
        )}
      >
        <AvatarWithBadge
          imageUrl={item.actor?.avatar || ""}
          className="h-12 w-12"
        />
      </div>

      <div className="min-w-0 flex-1 ">
        <p className="text-sm text-foreground">
          <span
            className="font-semibold group-hover:text-foreground group-hover:underline"
            onClick={() => navigate(`/profile/${item.actor?._id}`)}
          >
            {actorName}
          </span>{" "}
          <span className="text-muted-foreground">{meta.label}</span>
        </p>

        {item.post?.caption && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            "{item.post.caption}"
          </p>
        )}

        <p className="mt-2 text-xs text-muted-foreground/80">
          {formatDistanceToNow(new Date(item.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>

      {!item.read && (
        <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500" />
      )}
    </div>
  );
};

export default NotificationItem;
