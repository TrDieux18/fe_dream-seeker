import type React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/use-profile";
import ProfileHeader from "@/components/profile/profile-header";
import ProfilePostGrid from "@/components/profile/profile-post-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useModal } from "@/hooks/use-modal";
import ProfileSkeleton from "@/components/profile/profile-skeleton";
import { usePost } from "@/hooks/use-post";
import { Bookmark, Grid3X3 } from "lucide-react";
import EmptyState from "@/components/empty-state";

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { closeAllModals } = useModal();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
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
  const {
    savedPosts,
    isSavedPostsLoading,
    fetchSavedPosts,
    hasLoadedSavedPosts,
  } = usePost();

  // Use current user ID if no userId param
  const targetUserId = userId || currentUser?._id;
  const isOwnProfile = Boolean(
    currentUser?._id && targetUserId === currentUser._id,
  );

  useEffect(() => {
    if (!targetUserId) {
      navigate("/feed");
      return;
    }

    // Clear previous profile data
    clearProfile();
    closeAllModals();

    // Fetch profile and posts
    fetchUserProfile(targetUserId);
    fetchUserPosts(targetUserId);

    // Cleanup
    return () => {
      clearProfile();
    };
  }, [targetUserId, navigate, clearProfile, fetchUserProfile, fetchUserPosts]);

  useEffect(() => {
    if (activeTab === "saved" && isOwnProfile && !hasLoadedSavedPosts) {
      fetchSavedPosts();
    }
  }, [activeTab, fetchSavedPosts, hasLoadedSavedPosts, isOwnProfile]);

  const handleLoadMore = () => {
    if (targetUserId && !isLoadingMore && hasMorePosts) {
      fetchMorePosts(targetUserId);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen gap-4 hover:cursor-pointer"
        onClick={() => navigate("/feed")}
      >
        <EmptyState title="Profile not found" description="Back to Feed" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header */}
      <ProfileHeader profile={profile} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-border/30 bg-background">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <TabsList
              variant="line"
              className="w-full justify-center h-auto p-0 border-0"
            >
              <TabsTrigger
                value="posts"
                className="flex-1 max-w-50 rounded-none border-0 border-b-2 border-b-transparent data-[state=active]:border-b-foreground"
              >
                <Grid3X3 className="size-6" />
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="flex-1 max-w-50 rounded-none border-0 border-b-2 border-b-transparent data-[state=active]:border-b-foreground"
                disabled={!isOwnProfile}
              >
                <Bookmark className="size-6" />
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
          <ProfilePostGrid
            posts={savedPosts}
            isLoading={isSavedPostsLoading}
            isLoadingMore={false}
            hasMore={false}
            onLoadMore={() => undefined}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
