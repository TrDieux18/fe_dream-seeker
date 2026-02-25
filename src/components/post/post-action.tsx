import type React from "react";
import { MessageCircle, Send, Bookmark } from "lucide-react";
import { Button } from "../ui/button";
import type { PostType } from "@/types/post.type";
import { useAuth } from "@/hooks/use-auth";
import PostLikeButton from "./post-like-button";

interface PostActionsProps {
  post: PostType;
  onLike: (postId: string) => void;
  onUnlike: (postId: string) => void;
  onComment: () => void;
  onShare?: () => void;
  onSave?: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  post,
  onLike,
  onUnlike,
  onComment,
  onShare,
  onSave,
}) => {
  const { user: currentUser } = useAuth();
  const isLiked = currentUser ? post.likes.includes(currentUser._id) : false;

  return (
    <div className="px-2">
      <div className="flex items-center justify-between">
        {/* Left Actions */}
        <div className="flex items-center gap-4">
          {/* Like Button with Floating Hearts */}
          <PostLikeButton
            isLiked={isLiked}
            onLike={() => onLike(post._id)}
            onUnlike={() => onUnlike(post._id)}
          />

          {/* Comment Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-transparent"
            onClick={onComment}
          >
            <MessageCircle
              className="w-7 h-7 hover:text-muted-foreground"
              strokeWidth={2}
            />
          </Button>

          {/* Share Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-transparent"
            onClick={onShare}
          >
            <Send
              className="w-7 h-7 hover:text-muted-foreground"
              strokeWidth={2}
            />
          </Button>
        </div>

        {/* Right Actions */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 hover:bg-transparent"
          onClick={onSave}
        >
          <Bookmark
            className="w-7 h-7 hover:text-muted-foreground"
            strokeWidth={2}
          />
        </Button>
      </div>
    </div>
  );
};

export default PostActions;
