import type { UserType } from "./auth.type";
import type { PostType } from "./post.type";

export interface UserProfile {
   user: UserType;
   stats: {
      posts: number;
      followers: number;
      following: number;
      chats: number;
   };
   isOwnProfile: boolean;
}

export interface UpdateProfilePayload {
   name?: string;
   bio?: string;
   avatar?: string;
}

export interface ProfilePostsResponse {
   posts: PostType[];
   totalCount: number;
   hasMore: boolean;
}
