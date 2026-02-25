import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/use-auth";

interface SuggestedUser {
  _id: string;
  name: string;
  avatar?: string;
  username?: string;
  mutualFollowers?: number;
}

const SuggestionsPanel: React.FC = () => {
  const { user } = useAuth();

 
  const suggestedUsers: SuggestedUser[] = [];

  const handleFollow = (userId: string) => {
    
    console.log("Follow user:", userId);
  };

  return (
    <div className="space-y-6">
      {/* Current User Profile */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar size="default">
            <AvatarImage src={user?.avatar ?? undefined} alt={user?.name} />
            <AvatarFallback>
              {user?.name?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{user?.name}</span>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
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
        {suggestedUsers.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">
              No suggestions available
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {suggestedUsers.map((suggestedUser) => (
              <div
                key={suggestedUser._id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarImage
                      src={suggestedUser.avatar ?? undefined}
                      alt={suggestedUser.name}
                    />
                    <AvatarFallback>
                      {suggestedUser.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      {suggestedUser.name}
                    </span>
                    {suggestedUser.mutualFollowers && (
                      <span className="text-xs text-muted-foreground">
                        Followed by {suggestedUser.mutualFollowers} others
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-semibold text-blue-500 hover:text-blue-600 hover:bg-transparent"
                  onClick={() => handleFollow(suggestedUser._id)}
                >
                  Follow
                </Button>
              </div>
            ))}
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
