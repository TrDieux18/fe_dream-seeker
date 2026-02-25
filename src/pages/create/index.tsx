import CreatePost from "@/components/post/create-post";
import FeedLayout from "@/layouts/feed-layout";

const CreatePage = () => {
  return (
    <FeedLayout showRightSidebar={false}>
      <div className="py-8 px-4">
        <CreatePost />
      </div>
    </FeedLayout>
  );
};

export default CreatePage;
