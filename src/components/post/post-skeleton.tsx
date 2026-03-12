import type React from "react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const PostSkeleton: React.FC = () => {
  return (
    <Card className="mx-auto mb-6 w-full max-w-117.5 overflow-hidden rounded-[32px] border border-border/60 bg-card/95 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.45)] backdrop-blur">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-6 w-18 rounded-full" />
            </div>
            <Skeleton className="h-3.5 w-32 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>

      {/* Image Skeleton */}
      <div className="mx-5 overflow-hidden rounded-[28px] border border-border/50">
        <Skeleton className="aspect-4/5 w-full" />
      </div>

      {/* Actions Skeleton */}
      <div className="flex items-center justify-between gap-3 px-5 pt-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="hidden h-10 w-24 rounded-full sm:block" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      {/* Engagement Skeleton */}
      <div className="px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-26 rounded-full" />
          <Skeleton className="h-4 w-18 rounded-full" />
        </div>
        <div className="mt-3 rounded-2xl bg-muted/35 px-4 py-3">
          <Skeleton className="mb-2 h-4 w-28 rounded-full" />
          <Skeleton className="h-3.5 w-full rounded-full" />
          <Skeleton className="mt-2 h-3.5 w-2/3 rounded-full" />
        </div>
        <Skeleton className="mt-3 h-4 w-28 rounded-full" />
      </div>

      {/* Open Discussion Skeleton */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between rounded-2xl border border-dashed border-border/65 bg-muted/22 px-4 py-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-full" />
              <Skeleton className="h-3.5 w-40 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-7 w-10 rounded-full" />
        </div>
      </div>
    </Card>
  );
};

export default PostSkeleton;
