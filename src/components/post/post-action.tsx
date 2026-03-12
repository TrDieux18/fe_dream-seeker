import type React from "react";
import { MessageCircle, Send, Bookmark } from "lucide-react";
import type { PostType } from "@/types/post.type";
import PostLikeButton from "./post-like-button";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "../ui/spinner";
import ActionPillButton from "../ui/action-pill-button";

interface PostActionsProps {
  post: PostType;
  onLike: (postId: string) => void;
  onUnlike: (postId: string) => void;
  onComment: () => void;
  onShare?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  isSaved?: boolean;
}

const PostActions: React.FC<PostActionsProps> = ({
  post,
  onLike,
  onUnlike,
  onComment,
  onShare,
  onSave,
  isSaving,
  isSaved,
}) => {
  const { user: currentUser } = useAuth();
  const isLiked = currentUser ? post.likes.includes(currentUser._id) : false;

  return (
    <div className="px-5 pt-4">
      <div className="flex items-center justify-between gap-3">
        {/* Left Actions */}
        <div className="flex items-center gap-2">
          {/* Like Button with Floating Hearts */}
          <PostLikeButton
            isLiked={isLiked}
            onLike={() => onLike(post._id)}
            onUnlike={() => onUnlike(post._id)}
            showLabel
          />

          {/* Comment Button */}
          <ActionPillButton label="Comment" onClick={onComment}>
            <MessageCircle className="h-5 w-5" strokeWidth={2} />
          </ActionPillButton>

          {/* Share Button */}
          <ActionPillButton
            label="Share"
            className="hidden sm:flex"
            onClick={onShare}
          >
            <Send className="h-5 w-5" strokeWidth={2} />
          </ActionPillButton>
        </div>

        {/* Right Actions */}
        <ActionPillButton active={isSaved} onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            <span className="text-sm text-muted-foreground">
              <Spinner className="w-5 h-5" />
            </span>
          ) : (
            <Bookmark
              className={
                isSaved ? "h-5 w-5 fill-current text-foreground" : "h-5 w-5"
              }
              strokeWidth={2}
            />
          )}
        </ActionPillButton>
      </div>
    </div>
  );
};

export default PostActions;
