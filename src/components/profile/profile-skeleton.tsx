import { Skeleton } from "../ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="flex">
          <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-8">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              <div className="flex justify-center md:justify-start shrink-0">
                <Skeleton className="h-30 w-30 rounded-full" />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex flex-col  items-start  gap-2">
                  <div className="flex gap-x-2">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                  <div className="flex flex-col w-full sm:w-auto  gap-2">
                    <Skeleton className="h-6 w-24" />
                    <div className="flex gap-x-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="w-full justify-center bg-transparent h-auto p-0 border-0 flex gap-x-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-15 ">
          <div className="grid grid-cols-3 gap-1 md:gap-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSkeleton;
