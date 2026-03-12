import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { CommentType } from "@/types/post.type";
import { formatDistanceToNow } from "date-fns";
import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import MetaPill from "../ui/meta-pill";

interface PostCommentItemProps {
  comment: CommentType;
  currentUserId: string | null;
  onLike?: (commentId: string) => void;
  onUnlike?: (commentId: string) => void;
}

const PostCommentItem: React.FC<PostCommentItemProps> = ({
  comment,
  currentUserId,
  onLike,
  onUnlike,
}) => {
  const isLiked = currentUserId ? comment.likes.includes(currentUserId) : false;
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  const handleLikeClick = () => {
    if (!currentUserId) return;
    if (isLiked) {
      onUnlike?.(comment._id);
    } else {
      onLike?.(comment._id);
    }
  };

  return (
    <div className="flex gap-3 rounded-2xl border border-border/50 bg-background/80 px-3 py-3 shadow-[0_12px_32px_-28px_rgba(0,0,0,0.55)]">
      <Avatar size="sm">
        <AvatarImage
          src={comment.user.avatar || undefined}
          alt={comment.user.name}
        />
        <AvatarFallback>
          {comment.user.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <span className="mr-2 text-sm font-semibold">
              {comment.user.name}
            </span>
            <span className="text-sm leading-6 text-foreground/90">
              {comment.content}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full hover:bg-muted"
            onClick={handleLikeClick}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isLiked
                  ? "fill-red-500 text-red-500"
                  : "hover:text-muted-foreground"
              }`}
              strokeWidth={2}
            />
          </Button>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
          {comment.likesCount > 0 && (
            <MetaPill
              className="px-2 py-0.5 text-[11px] font-semibold"
              variant="subtle"
            >
              {comment.likesCount} {comment.likesCount === 1 ? "like" : "likes"}
            </MetaPill>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCommentItem;
