import type React from "react";
import type { PostType } from "@/types/post.type";
import MetaPill from "../ui/meta-pill";

interface PostEngagementProps {
  post: PostType;
  onViewComments?: () => void;
}

const PostEngagement: React.FC<PostEngagementProps> = ({
  post,
  onViewComments,
}) => {
  return (
    <div className="px-5 py-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <MetaPill className="font-semibold">
          {post.likesCount.toLocaleString()}{" "}
          {post.likesCount === 1 ? "like" : "likes"}
        </MetaPill>
        <MetaPill onClick={onViewComments} variant="outline">
          {post.commentsCount.toLocaleString()}{" "}
          {post.commentsCount === 1 ? "comment" : "comments"}
        </MetaPill>
      </div>

      {post.caption && (
        <div className="mt-3 rounded-2xl bg-muted/35 px-4 py-3 text-sm leading-6 text-foreground/90">
          <span className="mr-2 font-semibold text-foreground">
            {post.user.username}
          </span>
          <span>{post.caption}</span>
        </div>
      )}
    </div>
  );
};

export default PostEngagement;
