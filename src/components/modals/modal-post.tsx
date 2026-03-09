import { useModal } from "@/hooks/use-modal";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import type { PostType } from "@/types/post.type";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Smile,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Separator } from "../ui/separator";
import AvatarWithBadge from "../avatar-with-badge";
import { usePost } from "@/hooks/use-post";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { isUserOnline } from "@/lib/helper";

const ModalPost = () => {
  const { isModalOpen, closeModal, getModalData } = useModal();
  const modalData = getModalData("ModalPost") as { post: PostType } | null;
  const post = modalData?.post;

  const { user } = useAuth();
  const {
    singlePost,
    fetchComments,
    likePost,
    unlikePost,
    createComment,
    isCommentsLoading,
    isSendingComment,
  } = usePost();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (post?._id && isModalOpen("ModalPost")) {
      fetchComments(post._id);
    }
  }, [post?._id, isModalOpen]);

  if (!post) return null;

  const isLiked = user ? post.likes.includes(user._id) : false;
  const comments = singlePost?.comments || [];
  const hasMultipleImages = post.images.length > 1;

  const handleLikeToggle = () => {
    if (isLiked) {
      unlikePost(post._id);
    } else {
      likePost(post._id);
    }
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim() || isSendingComment) return;
    createComment({ postId: post._id, content: commentText });
    setCommentText("");
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + post.images.length) % post.images.length,
    );
  };

  return (
    <>
      <Dialog
        open={isModalOpen("ModalPost")}
        onOpenChange={() => closeModal("ModalPost")}
      >
        <DialogContent
          className="max-w-[90vw] w-[90vw] max-h-[90vh] h-[90vh] p-0 gap-0 bg-background overflow-hidden"
          showCloseButton={true}
        >
          <DialogTitle className="sr-only">
            Post by {post.user?.name}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {post.caption ||
              `View post with ${post.likesCount} likes and ${post.commentsCount} comments`}
          </DialogDescription>

          <div className="flex h-full w-full overflow-hidden">
            {/* Left: Image Section */}
            <div className="relative w-[65%] h-full bg-black flex items-center justify-center shrink-0">
              <img
                src={post.images[currentImageIndex]}
                alt={`Post image ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {/* Navigation Arrows */}
              {hasMultipleImages && (
                <>
                  {currentImageIndex > 0 && (
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 text-black" />
                    </button>
                  )}
                  {currentImageIndex < post.images.length - 1 && (
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                    >
                      <ChevronRight className="w-5 h-5 text-black" />
                    </button>
                  )}
                </>
              )}

              {hasMultipleImages && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                  {post.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "rounded-full transition-all",
                        index === currentImageIndex
                          ? "w-2 h-2 bg-white"
                          : "w-1.5 h-1.5 bg-white/60 hover:bg-white/80",
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right: Content Section */}
            <div className="flex-1 flex flex-col bg-background border-l overflow-hidden max-w-[35%]">
              {/* Header */}
              <div className="p-4 border-b shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AvatarWithBadge
                      imageUrl={post.user?.avatar || ""}
                      altText={post.user?.name}
                      size="md"
                      isOnline={isUserOnline(post.user?._id)}
                      badgeType="status-dot"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {post.user?.name}
                      </span>
                      {post.location && (
                        <span className="text-xs text-muted-foreground">
                          {post.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="flex-1 overflow-y-auto p-4 min-h-0">
                {/* Caption */}
                {post.caption && (
                  <div className="flex gap-3 mb-6">
                    <AvatarWithBadge
                      imageUrl={post.user?.avatar || ""}
                      altText={post.user?.name}
                      size="md"
                      isOnline={isUserOnline(post.user?._id)}
                      badgeType="status-dot"
                    />
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-sm">
                          {post.user?.name}
                        </span>
                        <span className="text-sm">{post.caption}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Comments List */}
                {isCommentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
                          <div className="h-2 w-16 bg-muted rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment._id} className="flex gap-3">
                        <AvatarWithBadge
                          imageUrl={comment.user?.avatar || ""}
                          altText={comment.user?.name}
                          size="sm"
                          isOnline={isUserOnline(comment.user?._id)}
                          badgeType="status-dot"
                        />
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="font-semibold text-sm">
                              {comment.user?.name}
                            </span>
                            <span className="text-sm">{comment.content}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    No comments yet. Be the first to comment!
                  </div>
                )}
              </div>

              {/* Actions & Engagement */}
              <div className="border-t shrink-0">
                {/* Action Buttons */}
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLikeToggle}
                      className="hover:opacity-60 transition-opacity"
                    >
                      <Heart
                        className={cn(
                          "w-7 h-7",
                          isLiked && "fill-red-500 text-red-500",
                        )}
                        strokeWidth={2}
                      />
                    </button>
                    <button className="hover:opacity-60 transition-opacity">
                      <MessageCircle className="w-7 h-7" strokeWidth={2} />
                    </button>
                    <button className="hover:opacity-60 transition-opacity">
                      <Send className="w-7 h-7" strokeWidth={2} />
                    </button>
                  </div>
                  <button className="hover:opacity-60 transition-opacity">
                    <Bookmark className="w-7 h-7" strokeWidth={2} />
                  </button>
                </div>

                {/* Likes Count */}
                <div className="px-4 pb-2">
                  <span className="font-semibold text-sm">
                    {post.likesCount} {post.likesCount === 1 ? "like" : "likes"}
                  </span>
                </div>

                {/* Date */}
                <div className="px-4 pb-3">
                  <span className="text-xs text-muted-foreground uppercase">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                <Separator />

                {/* Add Comment Input */}
                <div className="p-3 flex items-center gap-3">
                  <button
                    type="button"
                    className="hover:opacity-60 transition-opacity"
                  >
                    <Smile className="w-6 h-6" />
                  </button>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleCommentSubmit();
                      }
                    }}
                    className="flex-1 bg-transparent border-none outline-none text-sm"
                    disabled={isSendingComment}
                  />
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!commentText.trim() || isSendingComment}
                    className={cn(
                      "text-sm font-semibold transition-opacity",
                      commentText.trim() && !isSendingComment
                        ? "text-blue-500 hover:text-blue-600"
                        : "text-blue-500/50 cursor-not-allowed",
                    )}
                  >
                    {isSendingComment ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalPost;
