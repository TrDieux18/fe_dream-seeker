import type { UserType } from "@/types/auth.type";
import type React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useFollow } from "@/hooks/use-follow";
import { useAuth } from "@/hooks/use-auth";

interface UserItemProps {
  user: UserType;
}

const UserItem: React.FC<UserItemProps> = ({ user }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { checkFollowStatus, toggleFollow, isFollowing, isLoading } =
    useFollow();

  const isOwnUser = currentUser?._id === user._id;
  const following = isFollowing(user._id);
  const loading = isLoading(user._id);

  useEffect(() => {
    if (!isOwnUser) {
      checkFollowStatus(user._id);
    }
  }, [isOwnUser, user._id, checkFollowStatus]);

  const handleToggleFollow = async () => {
    if (isOwnUser) return;
    await toggleFollow(user._id);
  };

  return (
    <>
      <div className="p-4 hover:bg-muted rounded-lg  flex items-center justify-between group">
        <div
          className="flex items-center gap-3"
          onClick={() => navigate(`/profile/${user._id}`)}
        >
          <img
            src={user.avatar || "/default-avatar.png"}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium group-hover:underline cursor-pointer">
              {user.username}
            </p>
            <p className="text-sm text-muted-foreground">{user.name}</p>
          </div>
        </div>
        {!isOwnUser && (
          <Button
            size="sm"
            variant={following ? "secondary" : "default"}
            className="cursor-pointer"
            disabled={loading}
            onClick={handleToggleFollow}
          >
            {loading ? "Loading..." : following ? "Following" : "Follow"}
          </Button>
        )}
      </div>
    </>
  );
};

export default UserItem;
