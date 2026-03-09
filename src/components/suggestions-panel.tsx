import type React from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/use-auth";
import AvatarWithBadge from "./avatar-with-badge";
import { useFollow } from "@/hooks/use-follow";
import { useEffect } from "react";
import { Skeleton } from "./ui/skeleton";

const SuggestionsPanel: React.FC = () => {
  const { user } = useAuth();

  const {
    suggestUsers: suggestedUsers,
    getSuggestionUsers,
    isLoadingSuggestions,
    toggleFollow,
    isLoading,
  } = useFollow();

  useEffect(() => {
    if (user) {
      getSuggestionUsers();
    }
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Current User Profile */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AvatarWithBadge imageUrl={user?.avatar ?? undefined} />
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{user?.username}</span>
            <span className="text-xs text-muted-foreground">{user?.name}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-xs font-semibold">
          Switch
        </Button>
      </div>

      {/* Suggestions Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Suggestions For You
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs font-semibold h-auto p-0"
          >
            See All
          </Button>
        </div>

        {/* Suggested Users List */}
        {isLoadingSuggestions ? (
          <div className="space-y-3">
            {suggestedUsers.map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        ) : suggestedUsers.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">
              No suggestions available
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {suggestedUsers.map((suggestedUser) => {
              const isUserLoading = isLoading(suggestedUser._id);

              return (
                <div
                  key={suggestedUser._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <AvatarWithBadge
                      imageUrl={suggestedUser.avatar ?? undefined}
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {suggestedUser.name}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => toggleFollow(suggestedUser._id)}
                    variant="ghost"
                    size="sm"
                    disabled={isUserLoading}
                    className="text-xs font-semibold text-blue-500 hover:text-blue-600 hover:bg-transparent disabled:opacity-50"
                  >
                    {isUserLoading ? "Loading..." : "Follow"}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Links */}
      <div className="pt-6 space-y-3">
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <a href="#" className="hover:underline">
            About
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Help
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Press
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            API
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Jobs
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Terms
          </a>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 REALTIME MESSAGE</p>
      </div>
    </div>
  );
};

export default SuggestionsPanel;
