import type { UserType } from "@/types/auth.type";
import type React from "react";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal";

interface UserItemProps {
  user: UserType;
}

const UserItem: React.FC<UserItemProps> = ({ user }) => {
  const { openModal } = useModal();

  return (
    <>
      <div className="p-4 hover:bg-muted rounded-lg  flex items-center justify-between ">
        <div
          className="flex items-center gap-3"
          onMouseEnter={() => openModal("ModalUserPreview", { user })}
        >
          <img
            src={user.avatar || "/default-avatar.png"}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium">{user.username}</p>
            <p className="text-sm text-muted-foreground">{user.name}</p>
          </div>
        </div>
        <Button size="sm">Follow</Button>
      </div>
    </>
  );
};

export default UserItem;
