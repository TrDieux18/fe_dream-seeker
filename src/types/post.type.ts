import type { UserType } from "./auth.type";

export type PostType = {
   _id: string;
   user: UserType;
   caption?: string;
   images: string[];
   location?: string;
   likes: string[];
   likesCount: number;
   commentsCount: number;
   createdAt: string;
   updatedAt: string;
};

export type CommentType = {
   _id: string;
   post: string;
   user: UserType;
   content: string;
   likes: string[];
   likesCount: number;
   createdAt: string;
   updatedAt: string;
};

export type CreatePostType = {
   caption?: string;
   images: string[];
   location?: string;
};

export type CreateCommentType = {
   postId: string;
   content: string;
};

export type FeedBreakdown = {
   prioritizedCount: number;
   suggestedCount: number;
   prioritizedTotal: number;
   suggestedTotal: number;
};

export type FeedResponse = {
   posts: PostType[];
   feedBreakdown: FeedBreakdown;
   pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
   };
};

export type SavedPostsResponse = {
   posts: PostType[];
   savedPostIds: string[];
};
