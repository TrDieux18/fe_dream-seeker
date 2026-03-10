import { Skeleton } from "../ui/skeleton";

const ChatListSkeleton = () => {
  return (
    <>
      <div className="w-full flex items-center gap-3 px-5 py-3 ">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 min-w-0">
          <div className="flex  justify-between mb-1 ">
            <div className="flex flex-col gap-y-2">
              <Skeleton className="h-5 w-30" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatListSkeleton;
