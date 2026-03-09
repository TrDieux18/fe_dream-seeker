import type React from "react";
import type { UserProfile } from "@/types/profile.type";
import { Button } from "@/components/ui/button";
import { Settings, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/routes";
import AvatarWithBadge from "../avatar-with-badge";
import { useModal } from "@/hooks/use-modal";

interface ProfileHeaderProps {
  profile: UserProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const { openModal } = useModal();
  const navigate = useNavigate();
  const { user, stats, isOwnProfile } = profile;

  const handleMessage = () => {
    navigate(PROTECTED_ROUTES.CHAT);
  };

  return (
    <div className="border-b border-border/30 bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Avatar */}
          <div className="flex justify-center md:justify-start shrink-0">
            <AvatarWithBadge
              imageUrl={user.avatar || ""}
              className="h-30 w-30"
            />
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-2">
            {/* Username and Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <h1 className="text-xl font-semibold">{user.username}</h1>

              <div className="flex w-full sm:w-auto items-center">
                {isOwnProfile ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openModal("ModalEditProfile", { profile })}
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 sm:flex-none"
                    >
                      Follow
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleMessage}
                      className="flex-1 sm:flex-none"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </>
                )}
              </div>
            </div>

            <span className="text-sm">{user.name}</span>

            {/* Stats */}
            <div className="flex gap-6 text-sm items-center">
              <div className="flex gap-1">
                <span className="font-semibold">{stats.posts}</span>
                <span className="text-muted-foreground">posts</span>
              </div>
              <button className="flex gap-1 hover:text-foreground transition-colors">
                <span className="font-semibold">{stats.followers}</span>
                <span className="text-muted-foreground">followers</span>
              </button>
              <button className="flex gap-1 hover:text-foreground transition-colors">
                <span className="font-semibold">{stats.following}</span>
                <span className="text-muted-foreground">following</span>
              </button>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="text-sm">
                <p className="whitespace-pre-wrap">{user.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
