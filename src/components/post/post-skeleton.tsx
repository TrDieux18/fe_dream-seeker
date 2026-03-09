import type React from "react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const PostSkeleton: React.FC = () => {
  return (
    <Card className="w-full max-w-117.5 mx-auto mb-4 overflow-hidden border-border/50">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-6 w-6 rounded" />
      </div>

      {/* Caption Skeleton */}
      <div className="px-4 pb-2 space-y-2">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
      </div>

      {/* Image Skeleton */}
      <Skeleton className="w-full aspect-square" />

      {/* Actions Skeleton */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-6 w-6 rounded" />
        </div>
        <Skeleton className="h-6 w-6 rounded" />
      </div>

      {/* Engagement Skeleton */}
      <div className="px-4 pb-3 space-y-2">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-3 w-32" />
      </div>
    </Card>
  );
};

export default PostSkeleton;
