import { API } from "@/lib/axios-client";
import type { UserType } from "@/types/auth.type";
import { toast } from "sonner";
import { create } from "zustand";

interface FollowState {
   followingMap: Record<string, boolean>;
   loadingMap: Record<string, boolean>;
   suggestUsers: UserType[];
   isLoadingSuggestions: boolean;
   followerUser: UserType[]
   isFetchingFollowers: boolean;
   userFollowing: UserType[];
   isFetchingUserFollowing: boolean;


   checkFollowStatus: (userId: string) => Promise<boolean>;
   toggleFollow: (userId: string) => Promise<void>;
   setFollowStatus: (userId: string, isFollowing: boolean) => void;
   isFollowing: (userId: string) => boolean;
   isLoading: (userId: string) => boolean;
   getSuggestionUsers: () => Promise<void>;
   getFollowerUser: (userId: string) => Promise<void>;
   getUserFollowing: (userId: string) => Promise<void>;

}

export const useFollow = create<FollowState>()((set, get) => ({
   followingMap: {},
   loadingMap: {},
   suggestUsers: [],
   isLoadingSuggestions: false,
   followerUser: [],
   isFetchingFollowers: false,
   userFollowing: [],
   isFetchingUserFollowing: false,


   getSuggestionUsers: async () => {
      set({ isLoadingSuggestions: true });
      try {
         const response = await API.get("/user/suggest");
         set({ suggestUsers: response.data.suggestions });
      } catch (error: any) {
         console.error("Failed to fetch suggestion users:", error);
         toast.error(error?.response?.data?.message || "Failed to load suggestions");
      }
      finally {
         set({ isLoadingSuggestions: false });
      }
   },


   checkFollowStatus: async (userId: string) => {
      try {

         const response = await API.get(`/follow/status/${userId}`);
         const isFollowing = response.data.isFollowing;

         set((state) => ({
            followingMap: {
               ...state.followingMap,
               [userId]: isFollowing
            }
         }));

         return isFollowing;
      } catch (error) {
         console.error("Failed to check follow status:", error);
         return false;
      }
   },

   toggleFollow: async (userId: string) => {
      const state = get();
      const currentlyFollowing = state.followingMap[userId] || false;

      // Set loading state
      set((state) => ({
         loadingMap: {
            ...state.loadingMap,
            [userId]: true
         }
      }));

      try {
         if (currentlyFollowing) {
            // Unfollow
            await API.delete(`/follow/${userId}`);

            set((state) => ({
               followingMap: {
                  ...state.followingMap,
                  [userId]: false
               }
            }));

            toast.success("Unfollowed successfully");
         } else {
            // Follow
            await API.post(`/follow/${userId}`);

            set((state) => ({
               followingMap: {
                  ...state.followingMap,
                  [userId]: true
               },
               // Remove from suggestions after following
               suggestUsers: state.suggestUsers.filter(u => u._id !== userId)
            }));

            toast.success("Followed successfully");
         }
      } catch (error: any) {
         console.error("Failed to toggle follow:", error);
         toast.error(
            error?.response?.data?.message ||
            `Failed to ${currentlyFollowing ? 'unfollow' : 'follow'}`
         );
      } finally {

         set((state) => ({
            loadingMap: {
               ...state.loadingMap,
               [userId]: false
            }
         }));
      }
   },

   setFollowStatus: (userId: string, isFollowing: boolean) => {
      set((state) => ({
         followingMap: {
            ...state.followingMap,
            [userId]: isFollowing
         }
      }));
   },

   isFollowing: (userId: string) => {
      return get().followingMap[userId] || false;
   },

   isLoading: (userId: string) => {
      return get().loadingMap[userId] || false;
   },

   getFollowerUser: async (userId: string) => {
      set({ isFetchingFollowers: true });
      try {
         const response = await API.get(`/follow/followers/${userId}`);
         const followers: UserType[] = (response.data.followers || [])
            .map((follow: { followerId?: UserType }) => follow?.followerId)
            .filter(Boolean);
         set({ followerUser: followers });
      } catch (error: any) {
         console.error("Failed to fetch followers:", error);
         toast.error(error?.response?.data?.message || "Failed to load followers");
      } finally {
         set({ isFetchingFollowers: false });
      }
   },

   getUserFollowing: async (userId: string) => {
      set({ isFetchingUserFollowing: true });
      try {
         const response = await API.get(`/follow/following/${userId}`);
         const followings = (response.data.followings || [])
            .map((follow: { followingId?: UserType }) => follow?.followingId)
            .filter(Boolean);
         set({ userFollowing: followings });
      } catch (error: any) {
         console.error("Failed to fetch following users:", error);
         toast.error(error?.response?.data?.message || "Failed to load following users");
      } finally {
         set({ isFetchingUserFollowing: false });
      }
   }
}));