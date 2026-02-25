import type React from "react";
import type { PostType } from "@/types/post.type";

interface PostEngagementProps {
  post: PostType;
  onViewComments?: () => void;
}

const PostEngagement: React.FC<PostEngagementProps> = ({
  post,
  onViewComments,
}) => {
  return (
    <div className="px-4 pb-0.5">
      {/* Likes Count */}
      {post.likesCount > 0 && (
        <div className="mb-0">
          <span className="font-semibold text-sm">
            {post.likesCount.toLocaleString()}{" "}
            {post.likesCount === 1 ? "like" : "likes"}
          </span>
        </div>
      )}

      {/* Caption removed from here - now at top after media */}

      {/* View Comments */}
      {post.commentsCount > 0 && (
        <button
          className="text-muted-foreground text-sm hover:text-foreground transition-colors"
          onClick={onViewComments}
        >
          View all {post.commentsCount.toLocaleString()}{" "}
          {post.commentsCount === 1 ? "comment" : "comments"}
        </button>
      )}
    </div>
  );
};

export default PostEngagement;
