import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { CommentType } from "@/types/post.type";
import { formatDistanceToNow } from "date-fns";
import { Heart } from "lucide-react";
import { Button } from "../ui/button";

interface PostCommentItemProps {
  comment: CommentType;
  currentUserId: string | null;
  onLike?: (commentId: string) => void;
  onUnlike?: (commentId: string) => void;
  onReply?: (comment: CommentType) => void;
}

const PostCommentItem: React.FC<PostCommentItemProps> = ({
  comment,
  currentUserId,
  onLike,
  onUnlike,
  onReply,
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
    <div className="flex gap-3 py-2">
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
            <span className="font-semibold text-sm mr-2">
              {comment.user.name}
            </span>
            <span className="text-sm">{comment.content}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-transparent shrink-0"
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

        <div className="flex items-center gap-4 mt-1">
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
          {comment.likesCount > 0 && (
            <span className="text-xs text-muted-foreground font-semibold">
              {comment.likesCount} {comment.likesCount === 1 ? "like" : "likes"}
            </span>
          )}
          <button
            className="text-xs text-muted-foreground font-semibold hover:text-foreground"
            onClick={() => onReply?.(comment)}
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCommentItem;
