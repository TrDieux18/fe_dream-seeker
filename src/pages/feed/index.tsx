import PostList from "@/components/post/post-list";
import FeedLayout from "@/layouts/feed-layout";
import SuggestionsPanel from "@/components/suggestions-panel";

const FeedPage = () => {
  return (
    <FeedLayout rightSidebar={<SuggestionsPanel />}>
      <div className="py-6 px-4">
        <PostList />
      </div>
    </FeedLayout>
  );
};

export default FeedPage;
