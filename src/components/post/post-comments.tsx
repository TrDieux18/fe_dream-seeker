import type React from "react";
import { useState } from "react";
import PostCommentItem from "./post-comment-item";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Spinner } from "../ui/spinner";
import type { CommentType, PostType } from "@/types/post.type";
import { usePost } from "@/hooks/use-post";
import { useAuth } from "@/hooks/use-auth";

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

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;

    await createComment({
      postId: post._id,
      content: commentText.trim(),
    });

    setCommentText("");
  };

  return (
    <div className="border-t border-border/50 bg-linear-to-b from-muted/18 via-background to-background px-5 pb-5 pt-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Discussion</h4>
          <p className="text-xs text-muted-foreground">
            Join the conversation around this post
          </p>
        </div>
        {comments.length > 0 && (
          <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            {comments.length} items
          </span>
        )}
      </div>

      {/* Comments List */}
      <div className="max-h-88 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/70 bg-muted/25 px-4 py-8 text-center text-sm text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <PostCommentItem
                key={comment._id}
                comment={comment}
                currentUserId={currentUser?._id || null}
              />
            ))}
          </div>
        )}
      </div>

      {/* Comment Input */}
      {currentUser && (
        <form onSubmit={handleSubmitComment} className="mt-4">
          <div className="flex items-end gap-2 rounded-[24px] border border-border/60 bg-background px-3 py-2 shadow-[0_18px_38px_-32px_rgba(0,0,0,0.55)]">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="min-h-9 max-h-32 resize-none border-0 bg-transparent px-1 text-sm shadow-none focus-visible:ring-0"
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
              variant="default"
              size="sm"
              disabled={!commentText.trim() || isSendingComment}
              className="rounded-full px-4 font-semibold"
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
