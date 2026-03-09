import { useModal } from "@/hooks/use-modal";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import type { UserType } from "@/types/auth.type";
import { useEffect } from "react";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useNavigate } from "react-router-dom";

const ModalUserPreview = () => {
  const { isModalOpen, getModalData, closeModal, clearModalData } = useModal();
  const data = getModalData("ModalUserPreview") as {
    user: UserType;
  };

  const navigate = useNavigate();

  const user = data?.user;
  const userId = user?._id;

  const { posts, profile, fetchUserPosts, isLoadingPosts, fetchUserProfile } =
    useProfile();

  useEffect(() => {
    if (userId && isModalOpen("ModalUserPreview")) {
      fetchUserProfile(userId);
    }
  }, [userId, fetchUserProfile]);

  useEffect(() => {
    if (userId && isModalOpen("ModalUserPreview")) {
      fetchUserPosts(userId);
    }
  }, [userId, fetchUserPosts]);

  if (!user) return null;

  return (
    <Dialog
      open={isModalOpen("ModalUserPreview")}
      onOpenChange={() => {
        closeModal("ModalUserPreview");
        clearModalData("ModalUserPreview");
      }}
    >
      <DialogContent
        className="max-w-xs p-4"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">User Profile Preview</DialogTitle>
        <DialogDescription className="sr-only">
          Preview of {user.name}'s profile
        </DialogDescription>

        {/* User Info - Compact */}
        <div
          className="flex items-start gap-3 mb-3"
          onClick={() => navigate(`/profile/${userId}`)}
        >
          <img
            src={user.avatar || "/default-avatar.png"}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{user.username}</h3>
            <p className="text-muted-foreground text-xs truncate">
              {user.name}
            </p>
            {user.bio && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-around text-center mb-3 py-2 border-y">
          <div>
            <p className="font-semibold text-sm">{posts?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <div>
            <p className="font-semibold text-sm">
              {profile?.stats?.followers || 0}
            </p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div>
            <p className="font-semibold text-sm">
              {profile?.stats?.following || 0}
            </p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
        </div>

        {/* Recent Posts Grid */}
        {isLoadingPosts ? (
          <div className="text-center text-muted-foreground text-xs py-4">
            <Spinner className="mx-auto" />
            Loading...
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-3 gap-1 mb-3">
            {posts.slice(0, 3).map((post) => (
              <div
                key={post._id}
                className="aspect-square bg-muted rounded overflow-hidden"
              >
                {post.images && post.images.length > 0 && (
                  <img
                    src={post.images[0]}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground text-xs py-4">
            No posts yet
          </div>
        )}

        {/* Action Button */}
        <Button className="w-full" size="sm">
          Follow
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUserPreview;
