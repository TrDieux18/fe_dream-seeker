import type React from "react";
import { useEffect, useRef } from "react";
import type { PostType } from "@/types/post.type";
import { Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ProfilePostGridProps {
  posts: PostType[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const ProfilePostGrid: React.FC<ProfilePostGridProps> = ({
  posts,
  isLoading,
  isLoadingMore,
  hasMore,
  onLoadMore,
}) => {
  const navigate = useNavigate();
  const observerTarget = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (isLoading || isLoadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [isLoading, isLoadingMore, hasMore, onLoadMore]);

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-muted animate-pulse rounded-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-20">
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <div className="w-20 h-20 rounded-full border-2 border-foreground flex items-center justify-center">
            <MessageCircle className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">No Posts Yet</h3>
            <p className="text-sm text-muted-foreground">
              When you share photos, they will appear on your profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
      <div className="grid grid-cols-3 gap-1 md:gap-2">
        {posts.map((post) => (
          <button
            key={post._id}
            onClick={() => handlePostClick(post._id)}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-sm",
              "cursor-pointer transition-opacity hover:opacity-90",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            )}
          >
            {/* Post Image */}
            <img
              src={post.images[0]}
              alt={post.caption || "Post"}
              className="w-full h-full object-cover"
            />

            {/* Hover Overlay */}
            <div
              className={cn(
                "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100",
                "transition-opacity duration-200",
                "flex items-center justify-center gap-6 text-white",
              )}
            >
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 fill-white" />
                <span className="font-semibold">{post.likes.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6 fill-white" />
                <span className="font-semibold">{post.commentsCount}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Loading More */}
      {isLoadingMore && (
        <div className="grid grid-cols-3 gap-1 md:gap-2 mt-1 md:mt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-muted animate-pulse rounded-sm"
            />
          ))}
        </div>
      )}

      {/* Intersection Observer Target */}
      {hasMore && !isLoadingMore && (
        <div ref={observerTarget} className="h-8" />
      )}

      {/* End Message */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No more posts to load
        </div>
      )}
    </div>
  );
};

export default ProfilePostGrid;
