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
  const {
    posts,
    isFeedLoading,
    fetchFeed,
    fetchUserPosts,
    fetchSavedPosts,
    hasLoadedSavedPosts,
    feedBreakdown,
  } = usePost();

  useEffect(() => {
    if (!hasLoadedSavedPosts) {
      fetchSavedPosts();
    }

    if (userId) {
      fetchUserPosts(userId);
    } else {
      fetchFeed();
    }
  }, [fetchFeed, fetchSavedPosts, fetchUserPosts, hasLoadedSavedPosts, userId]);

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
      {!userId && (feedBreakdown?.suggestedCount || 0) > 0 && (
        <div className="mb-4 rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Showing {feedBreakdown?.suggestedCount} suggested post
          {feedBreakdown?.suggestedCount === 1 ? "" : "s"} after recent posts
          from accounts you follow.
        </div>
      )}

      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
