import type { UserType } from "@/types/auth.type";
import type React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface UserItemProps {
  user: UserType;
}

const UserItem: React.FC<UserItemProps> = ({ user }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="p-4 hover:bg-muted rounded-lg  flex items-center justify-between group">
        <div
          className="flex items-center gap-3"
          onClick={() => navigate(`/profile/${user._id}`)}
        >
          <img
            src={user.avatar || "/default-avatar.png"}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium group-hover:underline">{user.username}</p>
            <p className="text-sm text-muted-foreground">{user.name}</p>
          </div>
        </div>
        <Button size="sm">Follow</Button>
      </div>
    </>
  );
};

export default UserItem;
