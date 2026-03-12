import type React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MapPin, MoreHorizontal, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { PostType } from "@/types/post.type";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import AvatarWithBadge from "../avatar-with-badge";
import MetaPill from "../ui/meta-pill";

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
    <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
      <div className="flex min-w-0 items-center gap-3 group cursor-pointer">
        <AvatarWithBadge
          imageUrl={post.user.avatar || ""}
          altText={post.user.username}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="truncate font-semibold text-[15px] group-hover:underline"
              onClick={() => navigate(`/profile/${post.user?._id}`)}
            >
              {post.user.username}
            </span>
            <MetaPill className="px-2 py-0.5 text-[11px]" variant="subtle">
              {timeAgo}
            </MetaPill>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            {post.location ? (
              <>
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span className="truncate">{post.location}</span>
              </>
            ) : (
              <span className="truncate">Shared a new moment</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-0.5">
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-muted/30 transition-colors hover:bg-muted">
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
