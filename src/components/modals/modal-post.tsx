import { useModal } from "@/hooks/use-modal";
import { Dialog, DialogContent } from "../ui/dialog";
import type { PostType } from "@/types/post.type";
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Smile,
  X,
} from "lucide-react";
import { Separator } from "../ui/separator";

const ModalPost = () => {
  const { isModalOpen, closeModal, getModalData } = useModal();
  const post = getModalData("ModalPost") as {
    post: PostType;
  };
  console.log("Post data in ModalPost:", post);

  return (
    <>
      <Dialog
        open={isModalOpen("ModalPost")}
        onOpenChange={() => closeModal("ModalPost")}
      >
        <DialogContent
          className="w-[80vw] h-[90vh] p-0 gap-0 bg-background "
          showCloseButton={false}
        >
          {/* Custom Close Button */}

          <div className="flex h-full w-full">
            {/* Left: Image Section - Skeleton */}
            <div className="relative w-[65%]  bg-black flex items-center justify-center shrink-0">
              {/* Image Skeleton */}
              <div className="w-full h-full bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-gray-600 text-6xl">📷</div>
              </div>

              {/* Navigation Dots Skeleton */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/60"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/60"></div>
              </div>
            </div>

            {/* Right: Content Section - Skeleton */}
            <div className="flex-1 flex flex-col bg-background border-l">
              {/* Header Skeleton */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar Skeleton */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    {/* Name Skeleton */}
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <button className="p-1 hover:bg-muted rounded-full transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Comments Section - Skeleton */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Caption Skeleton */}
                <div className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-baseline gap-2">
                      <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Comment Skeleton 1 */}
                <div className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-baseline gap-2">
                      <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="h-2 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Comment Skeleton 2 */}
                <div className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-baseline gap-2">
                      <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Comment Skeleton 3 */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-baseline gap-2">
                      <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="h-2 w-14 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Actions & Engagement */}
              <div className="border-t">
                {/* Action Buttons */}
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-4">
                    <button className="hover:opacity-60 transition-opacity">
                      <Heart className="w-7 h-7" strokeWidth={2} />
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

                {/* Likes Count Skeleton */}
                <div className="px-4 pb-2">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>

                {/* Date Skeleton */}
                <div className="px-4 pb-3">
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
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
                    className="flex-1 bg-transparent border-none outline-none text-sm"
                    disabled
                  />
                  <button className="text-sm font-semibold text-blue-500 opacity-50 cursor-not-allowed">
                    Post
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
