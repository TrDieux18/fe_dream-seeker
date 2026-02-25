import { API } from "@/lib/axios-client";
import type { UserProfile, UpdateProfilePayload } from "@/types/profile.type";
import type { PostType } from "@/types/post.type";
import { toast } from "sonner";
import { create } from "zustand";

interface ProfileState {
   profile: UserProfile | null;
   posts: PostType[];
   isLoadingProfile: boolean;
   isLoadingPosts: boolean;
   isLoadingMore: boolean;
   hasMorePosts: boolean;
   isUpdating: boolean;

   fetchUserProfile: (userId: string) => Promise<void>;
   fetchUserPosts: (userId: string) => Promise<void>;
   fetchMorePosts: (userId: string) => Promise<void>;
   updateProfile: (data: UpdateProfilePayload) => Promise<void>;
   clearProfile: () => void;
}

export const useProfile = create<ProfileState>()((set, get) => ({
   profile: null,
   posts: [],
   isLoadingProfile: false,
   isLoadingPosts: false,
   isLoadingMore: false,
   hasMorePosts: true,
   isUpdating: false,

   fetchUserProfile: async (userId: string) => {
      set({ isLoadingProfile: true });
      try {
         const response = await API.get(`/user/profile/${userId}`);
         set({ profile: response.data });
      } catch (error: any) {
         console.error("Failed to fetch profile:", error);
         toast.error(error?.response?.data?.message || "Failed to load profile");
      } finally {
         set({ isLoadingProfile: false });
      }
   },

   fetchUserPosts: async (userId: string) => {
      set({ isLoadingPosts: true });
      try {
         const response = await API.get(`/user/profile/${userId}/posts`, {
            params: { limit: 12, offset: 0 }
         });
         set({
            posts: response.data.posts,
            hasMorePosts: response.data.hasMore
         });
      } catch (error: any) {
         console.error("Failed to fetch posts:", error);
         toast.error(error?.response?.data?.message || "Failed to load posts");
      } finally {
         set({ isLoadingPosts: false });
      }
   },

   fetchMorePosts: async (userId: string) => {
      const state = get();
      if (state.isLoadingMore || !state.hasMorePosts) return;

      set({ isLoadingMore: true });
      try {
         const currentOffset = state.posts.length;
         const response = await API.get(`/user/profile/${userId}/posts`, {
            params: { limit: 12, offset: currentOffset }
         });

         set({
            posts: [...state.posts, ...response.data.posts],
            hasMorePosts: response.data.hasMore,
            isLoadingMore: false
         });
      } catch (error: any) {
         console.error("Failed to fetch more posts:", error);
         toast.error(error?.response?.data?.message || "Failed to load more posts");
         set({ isLoadingMore: false });
      }
   },

   updateProfile: async (data: UpdateProfilePayload) => {
      set({ isUpdating: true });
      try {
         const response = await API.put("/user/profile", data);

         // Update profile state with new user data
         set((state) => ({
            profile: state.profile
               ? { ...state.profile, user: response.data.user }
               : null
         }));

         toast.success("Profile updated successfully");
      } catch (error: any) {
         console.error("Failed to update profile:", error);
         toast.error(error?.response?.data?.message || "Failed to update profile");
         throw error;
      } finally {
         set({ isUpdating: false });
      }
   },

   clearProfile: () => {
      set({
         profile: null,
         posts: [],
         hasMorePosts: true
      });
   }
}));
