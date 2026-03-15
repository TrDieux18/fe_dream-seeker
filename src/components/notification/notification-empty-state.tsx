import { Bell } from "lucide-react";

const NotificationEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-4 rounded-2xl bg-muted p-4">
        <Bell className="size-6 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">
        No notifications yet
      </h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        When someone follows you, likes your post, or comments, you will see it
        appear here instantly.
      </p>
    </div>
  );
};

export default NotificationEmptyState;
