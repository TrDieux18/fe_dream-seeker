import type React from "react";
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
import { useNavigate } from "react-router-dom";
import AvatarWithBadge from "../avatar-with-badge";

interface PostHeaderProps {
  post: PostType;
  onDelete?: (postId: string) => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post, onDelete }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const isOwner = currentUser?._id === post.user?._id;

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  if (!post.user) {
    return null;
  }

  return (
    <div className="flex items-center justify-between px-4">
      <div
        className="flex items-center gap-3 group cursor-pointer"
        onClick={() => navigate(`/profile/${post.user?._id}`)}
      >
        <AvatarWithBadge imageUrl={post.user.avatar || ""} />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm group-hover:underline">
              {post.user.username}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
          {post.location && (
            <span className="text-xs text-muted-foreground">
              {post.location}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
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
