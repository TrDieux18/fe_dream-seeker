import { API } from "@/lib/axios-client";
import type { PostType, CreatePostType, CreateCommentType, CommentType, FeedResponse } from "@/types/post.type";
import { toast } from "sonner";
import { create } from "zustand";

interface PostState {
   posts: PostType[];
   singlePost: {
      post: PostType;
      comments: CommentType[];
   } | null;

   isFeedLoading: boolean;
   isCreatingPost: boolean;
   isPostLoading: boolean;
   isCommentsLoading: boolean;
   isSendingComment: boolean;

   fetchFeed: (page?: number, limit?: number) => void;
   fetchUserPosts: (userId: string) => void;
   createPost: (payload: CreatePostType) => Promise<PostType | null>;
   fetchPostById: (postId: string) => void;
   deletePost: (postId: string) => void;
   likePost: (postId: string) => void;
   unlikePost: (postId: string) => void;
   createComment: (payload: CreateCommentType) => void;
   fetchComments: (postId: string, page?: number) => void;

   updatePostLike: (postId: string, userId: string, isLike: boolean) => void;
   addNewComment: (postId: string, comment: CommentType) => void;
}

export const usePost = create<PostState>()((set, get) => ({
   posts: [],
   singlePost: null,

   isFeedLoading: false,
   isCreatingPost: false,
   isPostLoading: false,
   isCommentsLoading: false,
   isSendingComment: false,

   fetchFeed: async (page = 1, limit = 10) => {
      set({ isFeedLoading: true });
      try {
         const response = await API.get<FeedResponse>(`/post/feed?page=${page}&limit=${limit}`);
         set({ posts: response.data.posts });
      } catch (error: any) {
         console.error("Failed to fetch feed:", error);
         toast.error(error?.response?.data?.message || "Failed to fetch feed");
      } finally {
         set({ isFeedLoading: false });
      }
   },

   fetchUserPosts: async (userId: string) => {
      set({ isFeedLoading: true });
      try {
         const response = await API.get(`/post/user/${userId}`);
         set({ posts: response.data.posts });
      } catch (error: any) {
         console.error("Failed to fetch user posts:", error);
         toast.error(error?.response?.data?.message || "Failed to fetch user posts");
      } finally {
         set({ isFeedLoading: false });
      }
   },

   createPost: async (payload: CreatePostType) => {
      set({ isCreatingPost: true });
      try {
         const response = await API.post("/post/create", payload);
         const newPost = response.data.post;
         set((state) => ({ posts: [newPost, ...state.posts] }));
         toast.success("Post created successfully");
         return newPost;
      } catch (error: any) {
         console.error("Failed to create post:", error);
         toast.error(error?.response?.data?.message || "Failed to create post");
         return null;
      } finally {
         set({ isCreatingPost: false });
      }
   },

   fetchPostById: async (postId: string) => {
      set({ isPostLoading: true });
      try {
         const response = await API.get(`/post/${postId}`);
         set({ singlePost: { post: response.data.post, comments: [] } });
      } catch (error: any) {
         console.error("Failed to fetch post:", error);
         toast.error(error?.response?.data?.message || "Failed to fetch post");
      } finally {
         set({ isPostLoading: false });
      }
   },

   deletePost: async (postId: string) => {
      try {
         await API.delete(`/post/${postId}`);
         set((state) => ({
            posts: state.posts.filter((post) => post._id !== postId)
         }));
         toast.success("Post deleted successfully");
      } catch (error: any) {
         console.error("Failed to delete post:", error);
         toast.error(error?.response?.data?.message || "Failed to delete post");
      }
   },

   likePost: async (postId: string) => {
      try {
         const response = await API.post(`/post/${postId}/like`);
         const updatedPost = response.data.post;

         // Update in posts list
         set((state) => ({
            posts: state.posts.map((post) =>
               post._id === postId ? { ...post, likes: updatedPost.likes, likesCount: updatedPost.likesCount } : post
            )
         }));

         // Update in single post view
         if (get().singlePost?.post._id === postId) {
            set((state) => ({
               singlePost: state.singlePost ? {
                  ...state.singlePost,
                  post: { ...state.singlePost.post, likes: updatedPost.likes, likesCount: updatedPost.likesCount }
               } : null
            }));
         }
      } catch (error: any) {
         console.error("Failed to like post:", error);
         toast.error(error?.response?.data?.message || "Failed to like post");
      }
   },

   unlikePost: async (postId: string) => {
      try {
         const response = await API.delete(`/post/${postId}/like`);
         const updatedPost = response.data.post;

         // Update in posts list
         set((state) => ({
            posts: state.posts.map((post) =>
               post._id === postId ? { ...post, likes: updatedPost.likes, likesCount: updatedPost.likesCount } : post
            )
         }));

         // Update in single post view
         if (get().singlePost?.post._id === postId) {
            set((state) => ({
               singlePost: state.singlePost ? {
                  ...state.singlePost,
                  post: { ...state.singlePost.post, likes: updatedPost.likes, likesCount: updatedPost.likesCount }
               } : null
            }));
         }
      } catch (error: any) {
         console.error("Failed to unlike post:", error);
         toast.error(error?.response?.data?.message || "Failed to unlike post");
      }
   },

   createComment: async (payload: CreateCommentType) => {
      set({ isSendingComment: true });
      try {
         const response = await API.post(`/post/${payload.postId}/comment`, {
            content: payload.content,
            parentCommentId: payload.parentCommentId
         });
         const newComment = response.data.comment;

         // Add comment to single post view
         get().addNewComment(payload.postId, newComment);

         toast.success("Comment added successfully");
      } catch (error: any) {
         console.error("Failed to create comment:", error);
         toast.error(error?.response?.data?.message || "Failed to create comment");
      } finally {
         set({ isSendingComment: false });
      }
   },

   fetchComments: async (postId: string, page = 1) => {
      set({ isCommentsLoading: true });
      try {
         const response = await API.get(`/post/${postId}/comments?page=${page}`);
         const comments = response.data.comments;

         set((state) => {
            // If singlePost exists and matches postId, update it
            if (state.singlePost && state.singlePost.post._id === postId) {
               return {
                  singlePost: {
                     ...state.singlePost,
                     comments
                  }
               };
            }
            // Otherwise, find the post from posts array and create singlePost
            const post = state.posts.find(p => p._id === postId);
            if (post) {
               return {
                  singlePost: {
                     post,
                     comments
                  }
               };
            }
            // If post not found, keep state as is
            return state;
         });
      } catch (error: any) {
         console.error("Failed to fetch comments:", error);
         toast.error(error?.response?.data?.message || "Failed to fetch comments");
      } finally {
         set({ isCommentsLoading: false });
      }
   },

   updatePostLike: (postId: string, userId: string, isLike: boolean) => {
      set((state) => ({
         posts: state.posts.map((post) => {
            if (post._id === postId) {
               const likes = isLike
                  ? [...post.likes, userId]
                  : post.likes.filter((id) => id !== userId);
               return { ...post, likes, likesCount: likes.length };
            }
            return post;
         })
      }));
   },

   addNewComment: (postId: string, comment: CommentType) => {
      // Update comments count in posts list
      set((state) => ({
         posts: state.posts.map((post) =>
            post._id === postId ? { ...post, commentsCount: post.commentsCount + 1 } : post
         )
      }));

      // Add to single post comments
      if (get().singlePost?.post._id === postId) {
         set((state) => ({
            singlePost: state.singlePost ? {
               ...state.singlePost,
               post: { ...state.singlePost.post, commentsCount: state.singlePost.post.commentsCount + 1 },
               comments: [comment, ...state.singlePost.comments]
            } : null
         }));
      }
   }
}));
