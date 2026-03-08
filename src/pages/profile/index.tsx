import type React from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/use-profile";
import ProfileHeader from "@/components/profile/profile-header";
import ProfilePostGrid from "@/components/profile/profile-post-grid";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const {
    profile,
    posts,
    isLoadingProfile,
    isLoadingPosts,
    isLoadingMore,

    hasMorePosts,
    fetchUserProfile,
    fetchUserPosts,
    fetchMorePosts,

    clearProfile,
  } = useProfile();

  // Use current user ID if no userId param
  const targetUserId = userId || currentUser?._id;
  console.log("ProfilePage targetUserId:", targetUserId);

  useEffect(() => {
    if (!targetUserId) {
      navigate("/feed");
      return;
    }

    // Clear previous profile data
    clearProfile();

    // Fetch profile and posts
    fetchUserProfile(targetUserId);
    fetchUserPosts(targetUserId);

    // Cleanup
    return () => {
      clearProfile();
    };
  }, [targetUserId, navigate, clearProfile, fetchUserProfile, fetchUserPosts]);

  const handleLoadMore = () => {
    if (targetUserId && !isLoadingMore && hasMorePosts) {
      fetchMorePosts(targetUserId);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-semibold">Profile not found</h2>
        <p className="text-muted-foreground">
          The user you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header */}
      <ProfileHeader profile={profile} />

      <Tabs defaultValue="posts" className="w-full">
        <div className="border-b border-border/30">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <TabsList className="w-full justify-center bg-transparent h-auto p-0 border-0">
              <TabsTrigger
                value="posts"
                className="flex-1 max-w-50 data-[state=active]:border-t-2 data-[state=active]:border-t-foreground rounded-none border-t-2 border-t-transparent"
              >
                POSTS
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="flex-1 max-w-50 data-[state=active]:border-t-2 data-[state=active]:border-t-foreground rounded-none border-t-2 border-t-transparent"
                disabled
              >
                SAVED
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="posts" className="mt-0">
          <ProfilePostGrid
            posts={posts}
            isLoading={isLoadingPosts}
            isLoadingMore={isLoadingMore}
            hasMore={hasMorePosts}
            onLoadMore={handleLoadMore}
          />
        </TabsContent>

        <TabsContent value="saved" className="mt-0">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-20 text-center">
            <p className="text-muted-foreground">
              Saved posts feature coming soon...
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
