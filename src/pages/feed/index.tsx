import PostList from "@/components/post/post-list";
import FeedLayout from "@/layouts/feed-layout";
import SuggestionsPanel from "@/components/suggestions-panel";

const FeedPage = () => {
  return (
    <FeedLayout rightSidebar={<SuggestionsPanel />}>
      <div className="px-3 py-5 sm:px-4 sm:py-6">
        <PostList />
      </div>
    </FeedLayout>
  );
};

export default FeedPage;
