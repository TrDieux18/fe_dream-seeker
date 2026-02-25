import EmptyState from "@/components/empty-state";
import FeedLayout from "@/layouts/feed-layout";

const ExplorePage = () => {
  return (
    <FeedLayout showRightSidebar={false}>
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <EmptyState
          title="Explore Coming Soon"
          description="Discover new posts and trending content"
        />
      </div>
    </FeedLayout>
  );
};

export default ExplorePage;
