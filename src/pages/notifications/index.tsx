import EmptyState from "@/components/empty-state";
import FeedLayout from "@/layouts/feed-layout";

const NotificationsPage = () => {
  return (
    <FeedLayout showRightSidebar={false}>
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <EmptyState
          title="Notifications Coming Soon"
          description="Stay updated with your activity and interactions"
        />
      </div>
    </FeedLayout>
  );
};

export default NotificationsPage;
