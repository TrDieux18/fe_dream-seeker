import EmptyState from "@/components/empty-state";
import FeedLayout from "@/layouts/feed-layout";

const SearchPage = () => {
  return (
    <FeedLayout showRightSidebar={false}>
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <EmptyState
          title="Search Coming Soon"
          description="Search for users, posts, and more"
        />
      </div>
    </FeedLayout>
  );
};

export default SearchPage;
