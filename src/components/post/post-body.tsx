import type React from "react";
import { Card } from "../ui/card";
import PostHeader from "./post-header";
import PostMedia from "./post-media";
import PostActions from "./post-action";
import PostEngagement from "./post-engagement";
import type { PostType } from "@/types/post.type";
import { usePost } from "@/hooks/use-post";
import { useAuth } from "@/hooks/use-auth";
import { useModal } from "@/hooks/use-modal";

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const {
    likePost,
    unlikePost,
    deletePost,
    savePost,
    savingPostIds,
    savedPostIds,
  } = usePost();
  const { user: currentUser } = useAuth();
  const { openModal } = useModal();

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

  const handleCommentClick = () => {
    openModal("ModalPost", { post });
  };

  const handleSave = () => {
    savePost(post._id);
  };

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

      <PostEngagement post={post} onViewComments={handleCommentClick} />
    </Card>
  );
};

export default Post;
