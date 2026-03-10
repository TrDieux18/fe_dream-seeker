import { Skeleton } from "../ui/skeleton";

const ProfilePostGridSkeleton = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-15 ">
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProfilePostGridSkeleton;
