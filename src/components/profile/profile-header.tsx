import type React from "react";
import type { UserProfile } from "@/types/profile.type";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/routes";

interface ProfileHeaderProps {
  profile: UserProfile;
  onEditProfile?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onEditProfile,
}) => {
  const navigate = useNavigate();
  const { user, stats, isOwnProfile } = profile;

  const handleMessage = () => {
    // Navigate to chat with this user
    navigate(PROTECTED_ROUTES.CHAT);
  };

  return (
    <div className="border-b border-border/30 bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Avatar */}
          <div className="flex justify-center md:justify-start shrink-0">
            <Avatar className="w-32 h-32 md:w-40 md:h-40 border-2 border-border">
              <AvatarImage src={user.avatar || ""} alt={user.name} />
              <AvatarFallback className="text-4xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Username and Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <h1 className="text-xl font-semibold">{user.name}</h1>

              <div className="flex gap-2 w-full sm:w-auto">
                {isOwnProfile ? (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onEditProfile}
                      className="flex-1 sm:flex-none"
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => navigate("/settings")}
                    >
                      <Settings className="h-4 w-4" />
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

            {/* Stats */}
            <div className="flex gap-6 text-sm">
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
