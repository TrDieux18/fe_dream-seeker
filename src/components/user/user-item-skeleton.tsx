import { Skeleton } from "../ui/skeleton";

const UserItemSkeleton = () => {
  return (
    <div className="p-4 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-8 w-20 rounded-md" />
    </div>
  );
};

export default UserItemSkeleton;
