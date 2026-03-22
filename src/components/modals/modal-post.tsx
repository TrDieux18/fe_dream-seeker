import { useModal } from "@/hooks/use-modal";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import type { PostType } from "@/types/post.type";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "../ui/separator";
import AvatarWithBadge from "../avatar-with-badge";
import { usePost } from "@/hooks/use-post";
import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { isUserOnline } from "@/lib/helper";
import PostActions from "@/components/post/post-action";
import { toast } from "sonner";
import EmojiPickerButton from "../ui/emoji-picker-button";

const ModalPost = () => {
  const { isModalOpen, closeModal, getModalData } = useModal();
  const modalData = getModalData("ModalPost") as { post: PostType } | null;
  const post = modalData?.post;

  const {
    singlePost,
    fetchComments,
    likePost,
    unlikePost,
    createComment,
    isCommentsLoading,
    isSendingComment,
    savePost,
    savingPostIds,
    savedPostIds,
  } = usePost();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [commentText, setCommentText] = useState("");
  const commentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (post?._id && isModalOpen("ModalPost")) {
      fetchComments(post._id);
    }
  }, [post?._id, isModalOpen]);

  useEffect(() => {
    if (post?._id) {
      setCurrentImageIndex(0);
      setCommentText("");
    }
  }, [post?._id]);

  if (!post) return null;

  const modalPost = singlePost?.post?._id === post._id ? singlePost.post : post;
  const comments =
    singlePost?.post?._id === post._id ? singlePost.comments : [];
  const hasMultipleImages = modalPost.images.length > 1;
  const isSaved = savedPostIds.includes(modalPost._id);
  const isSaving = savingPostIds.includes(modalPost._id);

  const handleCommentSubmit = () => {
    const trimmedComment = commentText.trim();
    if (!trimmedComment || isSendingComment) return;

    createComment({ postId: modalPost._id, content: trimmedComment });
    setCommentText("");
  };

  const handleCommentEmojiSelect = (emoji: string) => {
    setCommentText((prev) => prev + emoji);
  };

  const handleSaveToggle = () => {
    if (isSaving) return;
    savePost(modalPost._id);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % modalPost.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + modalPost.images.length) % modalPost.images.length,
    );
  };

  return (
    <>
      <Dialog
        open={isModalOpen("ModalPost")}
        onOpenChange={(open) => {
          if (!open) {
            closeModal("ModalPost");
          }
        }}
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
            <div className="relative z-10 w-[65%] h-full bg-black flex items-center justify-center shrink-0">
              <img
                src={modalPost.images[currentImageIndex]}
                alt={`Post image ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {/* Navigation Arrows */}
              {hasMultipleImages && (
                <>
                  {currentImageIndex > 0 && (
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white"
                    >
                      <ChevronLeft className="w-5 h-5 text-black" />
                    </button>
                  )}
                  {currentImageIndex < modalPost.images.length - 1 && (
                    <button
                      type="button"
                      aria-label="Next image"
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white"
                    >
                      <ChevronRight className="w-5 h-5 text-black" />
                    </button>
                  )}
                </>
              )}

              {hasMultipleImages && (
                <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1.5">
                  {modalPost.images.map((_, index) => (
                    <button
                      type="button"
                      aria-label={`Go to image ${index + 1}`}
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
            <div className="relative z-30 flex-1 flex flex-col bg-background border-l overflow-visible max-w-[35%]">
              {/* Header */}
              <div className="p-4 border-b shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AvatarWithBadge
                      imageUrl={modalPost.user?.avatar || ""}
                      altText={modalPost.user?.name}
                      size="md"
                      isOnline={isUserOnline(modalPost.user?._id)}
                      badgeType="status-dot"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {modalPost.user?.name}
                      </span>
                      {modalPost.location && (
                        <span className="text-xs text-muted-foreground">
                          {modalPost.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="flex-1 overflow-y-auto p-4 min-h-0">
                {/* Caption */}
                {modalPost.caption && (
                  <div className="flex gap-3 mb-6">
                    <AvatarWithBadge
                      imageUrl={modalPost.user?.avatar || ""}
                      altText={modalPost.user?.name}
                      size="md"
                      isOnline={isUserOnline(modalPost.user?._id)}
                      badgeType="status-dot"
                    />
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-sm">
                          {modalPost.user?.name}
                        </span>
                        <span className="text-sm">{modalPost.caption}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(modalPost.createdAt), {
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
                <PostActions
                  post={modalPost}
                  onLike={likePost}
                  onUnlike={unlikePost}
                  onComment={() => commentInputRef.current?.focus()}
                  onShare={() => toast.info("Share feature is coming soon")}
                  onSave={handleSaveToggle}
                  isSaving={isSaving}
                  isSaved={isSaved}
                />

                {/* Likes Count */}
                <div className="px-4 pb-2">
                  <span className="font-semibold text-sm">
                    {modalPost.likesCount}{" "}
                    {modalPost.likesCount === 1 ? "like" : "likes"}
                  </span>
                </div>

                {/* Date */}
                <div className="px-4 pb-3">
                  <span className="text-xs text-muted-foreground uppercase">
                    {formatDistanceToNow(new Date(modalPost.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                <Separator />

                {/* Add Comment Input */}
                <div className="relative p-3 flex items-center gap-3">
                  <EmojiPickerButton
                    onEmojiSelect={handleCommentEmojiSelect}
                    usePortal={false}
                    pickerWidth={300}
                    pickerHeight={360}
                  />
                  <input
                    ref={commentInputRef}
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
                    type="button"
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
