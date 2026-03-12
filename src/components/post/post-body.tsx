import type React from "react";
import { useState } from "react";
import { Card } from "../ui/card";
import PostHeader from "./post-header";
import PostMedia from "./post-media";
import PostActions from "./post-action";
import PostEngagement from "./post-engagement";
import PostComments from "./post-comments";
import type { PostType } from "@/types/post.type";
import { usePost } from "@/hooks/use-post";
import { Separator } from "../ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { MessageCircleMore } from "lucide-react";

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const {
    likePost,
    unlikePost,
    deletePost,
    fetchComments,
    singlePost,
    isCommentsLoading,
    savePost,
    savingPostIds,
    savedPostIds,
  } = usePost();
  const { user: currentUser } = useAuth();
  const [showComments, setShowComments] = useState(false);

  const handleDelete = (postId: string) => {
    deletePost(postId);
  };

  const handleDoubleTapLike = () => {
    if (!currentUser) return;

    const isLiked = post.likes.includes(currentUser._id);
    if (!isLiked) {
      likePost(post._id);
    }
  };

  const handleViewComments = () => {
    if (!showComments) {
      fetchComments(post._id);
    }
    setShowComments((prev) => !prev);
  };

  const handleCommentClick = () => {
    if (!showComments) {
      fetchComments(post._id);
      setShowComments(true);
    }
  };

  const handleSave = () => {
    savePost(post._id);
  };

  const comments = singlePost?.post._id === post._id ? singlePost.comments : [];
  const isSaving = savingPostIds.includes(post._id);
  const isSaved = savedPostIds.includes(post._id);

  return (
    <Card className="mx-auto mb-6 w-full max-w-117.5 overflow-hidden rounded-[32px] border border-border/60 bg-card/95 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.45)] backdrop-blur">
      <PostHeader post={post} onDelete={handleDelete} />

      <PostMedia images={post.images} onDoubleTap={handleDoubleTapLike} />

      <PostActions
        post={post}
        onLike={likePost}
        onUnlike={unlikePost}
        onComment={handleCommentClick}
        onShare={() => {
          // TODO: Implement share functionality
        }}
        onSave={handleSave}
        isSaving={isSaving}
        isSaved={isSaved}
      />

      <PostEngagement post={post} onViewComments={handleViewComments} />

      {showComments && (
        <>
          <div className="px-5">
            <Separator className="my-0 bg-border/50" />
          </div>
          <PostComments
            post={post}
            comments={comments}
            isLoading={isCommentsLoading}
          />
        </>
      )}

      {!showComments && post.commentsCount > 0 && (
        <div className="px-5 pb-5">
          <button
            type="button"
            onClick={handleCommentClick}
            className="flex w-full items-center justify-between rounded-2xl border border-dashed border-border/65 bg-muted/22 px-4 py-3 text-left transition-colors hover:bg-muted/35"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-sm">
                <MessageCircleMore
                  className="h-4.5 w-4.5 text-muted-foreground"
                  strokeWidth={2}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Open comments
                </p>
                <p className="text-xs text-muted-foreground">
                  See what people are saying and join in
                </p>
              </div>
            </div>
            <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
              {post.commentsCount}
            </span>
          </button>
        </div>
      )}
    </Card>
  );
};

export default Post;
