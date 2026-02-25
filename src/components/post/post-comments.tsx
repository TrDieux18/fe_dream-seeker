import type React from "react";
import { useRef, useState } from "react";
import PostCommentItem from "./post-comment-item";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Spinner } from "../ui/spinner";
import type { CommentType, PostType } from "@/types/post.type";
import { useAuth } from "@/hooks/use-auth";
import { usePost } from "@/hooks/use-post";

interface PostCommentsProps {
  post: PostType;
  comments: CommentType[];
  isLoading?: boolean;
}

const PostComments: React.FC<PostCommentsProps> = ({
  post,
  comments,
  isLoading,
}) => {
  const { user: currentUser } = useAuth();
  const { createComment, isSendingComment } = usePost();
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<CommentType | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;

    await createComment({
      postId: post._id,
      content: commentText.trim(),
      parentCommentId: replyingTo?._id,
    });

    setCommentText("");
    setReplyingTo(null);
  };

  const handleReply = (comment: CommentType) => {
    setReplyingTo(comment);
    textareaRef.current?.focus();
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    textareaRef.current?.focus();
  };

  return (
    <div>
      {/* Comments List */}
      <div className="px-4 pt-1 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-2">
            <Spinner />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-2">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className="space-y-0.5">
            {comments.map((comment) => (
              <PostCommentItem
                key={comment._id}
                comment={comment}
                currentUserId={currentUser?._id || null}
                onReply={handleReply}
              />
            ))}
          </div>
        )}
      </div>

      {/* Comment Input */}
      {currentUser && (
        <form onSubmit={handleSubmitComment} className="px-4 pb-1.5">
          {replyingTo && (
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Replying to{" "}
                <span className="font-semibold">{replyingTo.user.name}</span>
              </span>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={handleCancelReply}
              >
                Cancel
              </button>
            </div>
          )}
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="min-h-9 max-h-32 resize-none text-sm"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment(e);
                }
              }}
            />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              disabled={!commentText.trim() || isSendingComment}
              className="font-semibold text-primary hover:text-primary/80"
            >
              {isSendingComment ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PostComments;
