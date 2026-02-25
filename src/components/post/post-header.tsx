import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { PostType } from "@/types/post.type";
import { useAuth } from "@/hooks/use-auth";

interface PostHeaderProps {
  post: PostType;
  onDelete?: (postId: string) => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post, onDelete }) => {
  const { user: currentUser } = useAuth();
  const isOwner = currentUser?._id === post.user._id;

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="flex items-center justify-between px-4 ">
      <div className="flex items-center gap-3">
        <Avatar size="default">
          <AvatarImage
            src={post.user.avatar || undefined}
            alt={post.user.name}
          />
          <AvatarFallback>
            {post.user.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{post.user.name}</span>
          {post.location && (
            <span className="text-xs text-muted-foreground">
              {post.location}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{timeAgo}</span>
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-muted rounded-full transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 cursor-pointer"
                onClick={() => onDelete?.(post._id)}
              >
                <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default PostHeader;
