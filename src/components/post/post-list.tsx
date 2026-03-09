import type React from "react";
import { useEffect } from "react";
import { usePost } from "@/hooks/use-post";
import EmptyState from "../empty-state";
import Post from "./post-body";
import PostSkeleton from "./post-skeleton";

interface PostListProps {
  userId?: string;
}

const PostList: React.FC<PostListProps> = ({ userId }) => {
  const { posts, isFeedLoading, fetchFeed, fetchUserPosts } = usePost();

  useEffect(() => {
    if (userId) {
      fetchUserPosts(userId);
    } else {
      fetchFeed();
    }
  }, [userId]);

  if (isFeedLoading) {
    return (
      <div className="w-full">
        {[...Array(3)].map((_, index) => (
          <PostSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <EmptyState
          title={userId ? "No posts yet" : "No posts in your feed"}
          description={
            userId
              ? "This user hasn't posted anything yet."
              : "Follow users to see their posts here."
          }
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
