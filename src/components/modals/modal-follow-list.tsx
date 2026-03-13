import { useModal } from "@/hooks/use-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Search } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useFollow } from "@/hooks/use-follow";
import UserItem from "../user/user-item";

type FollowListMode = "followers" | "following";

const modalConfig: Record<
  FollowListMode,
  { title: string; placeholder: string; emptyText: string }
> = {
  followers: {
    title: "Followers",
    placeholder: "Search followers...",
    emptyText: "No followers found.",
  },
  following: {
    title: "Following",
    placeholder: "Search following...",
    emptyText: "No following found.",
  },
};

const ModalFollowList = () => {
  const { isModalOpen, closeModal, getModalData } = useModal();
  const {
    followerUser,
    userFollowing,
    getFollowerUser,
    getUserFollowing,
    isFetchingFollowers,
    isFetchingUserFollowing,
  } = useFollow();
  const isOpen = isModalOpen("ModalFollowList");

  const { userId: routeUserId } = useParams<{ userId: string }>();
  const modalData = getModalData("ModalFollowList") as
    | { userId?: string; mode?: FollowListMode }
    | undefined;
  const userId = modalData?.userId || routeUserId;
  const mode = modalData?.mode || "followers";

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchQuery("");
  }, [mode]);

  useEffect(() => {
    if (!isOpen || !userId) return;

    if (mode === "followers") {
      getFollowerUser(userId);
      return;
    }

    getUserFollowing(userId);
  }, [isOpen, mode, userId, getFollowerUser, getUserFollowing]);

  const users = mode === "followers" ? followerUser : userFollowing;

  const isLoading =
    mode === "followers" ? isFetchingFollowers : isFetchingUserFollowing;

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return users;

    return users.filter((user) =>
      user.username.toLowerCase().includes(normalizedQuery),
    );
  }, [users, searchQuery]);

  const config = modalConfig[mode];

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => closeModal("ModalFollowList")}>
      <DialogContent className="sm:max-w-130 p-0">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center mt-4">
            {config.title}
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="px-4 pb-4">
          <InputGroup className="rounded-lg border-none bg-muted px-2 py-2 shadow-none">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder={config.placeholder}
              className="h-8 rounded-lg border-0 bg-transparent text-[14px] placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <div className="mt-2 max-h-80 overflow-y-auto">
            {!isLoading && filteredUsers.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground mt-4">
                {config.emptyText}
              </p>
            ) : (
              filteredUsers.map((user) => (
                <UserItem key={user._id} user={user} />
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalFollowList;
