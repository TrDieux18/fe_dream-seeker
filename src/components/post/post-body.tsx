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
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "../ui/separator";

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
  } = usePost();
  const { user: currentUser } = useAuth();
  const [showComments, setShowComments] = useState(false);

  const handleDelete = (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePost(postId);
    }
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

  const comments = singlePost?.post._id === post._id ? singlePost.comments : [];

  return (
    <Card className="w-full max-w-117.5 mx-auto mb-4 overflow-hidden border-border/50">
      <PostHeader post={post} onDelete={handleDelete} />

      {/* Caption above image */}
      {post.caption && (
        <div className="px-4 pb-0.5">
          <span className="text-sm">{post.caption}</span>
        </div>
      )}

      <PostMedia images={post.images} onDoubleTap={handleDoubleTapLike} />

      <PostActions
        post={post}
        onLike={likePost}
        onUnlike={unlikePost}
        onComment={handleCommentClick}
        onShare={() => {
          console.log("Share post:", post._id);
        }}
        onSave={() => {
          console.log("Save post:", post._id);
        }}
      />

      <PostEngagement post={post} onViewComments={handleViewComments} />

      {showComments && (
        <>
          <Separator className="my-0" />
          <PostComments
            post={post}
            comments={comments}
            isLoading={isCommentsLoading}
          />
        </>
      )}
    </Card>
  );
};

export default Post;
