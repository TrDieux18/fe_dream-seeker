import { ArrowLeft, PenSquare, Search, Users, X } from "lucide-react";
import { Button } from "../ui/button";
import { useChat } from "@/hooks/use-chat";
import { memo, useEffect, useState, type ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { Spinner } from "../ui/spinner";
import type { UserType } from "@/types/auth.type";
import AvatarWithBadge from "../avatar-with-badge";
import { Checkbox } from "../ui/checkbox";

interface NewChatPopoverProps {
  children?: ReactNode;
}

export const NewChatPopover = memo(({ children }: NewChatPopoverProps) => {
  const { fetchAllUsers, users, isUsersLoading, createChat, isCreatingChat } =
    useChat();

  const [isOpen, setIsOpen] = useState(false);
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleBack = () => {
    setIsGroupMode(false);
    setGroupName("");
    setSelectedUsers([]);
  };

  const resetState = () => {
    setIsGroupMode(false);
    setGroupName("");
    setSearchQuery("");
    setSelectedUsers([]);
  };

  const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    resetState();
  };

  const handleCreateGroup = async () => {
    if (selectedUsers.length === 0) return;
    await createChat({
      isGroup: true,
      participants: selectedUsers,
      groupName: groupName.trim() || undefined,
    });

    setIsOpen(false);
    resetState();
  };

  const handleCreateChat = async (userId: string) => {
    setLoadingUserId(userId);
    try {
      await createChat({
        isGroup: false,
        participantId: userId,
      });

      setIsOpen(false);
      resetState();
    } finally {
      setLoadingUserId(null);
      setIsOpen(false);
      resetState();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {children || (
          <Button onClick={() => setIsOpen(true)} variant="ghost" size="icon">
            <PenSquare className="w-5! h-5!" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-96 max-w-[calc(100vw-2rem)] z-50 flex flex-col p-0 h-120"
      >
        <div className="border-b px-4 py-3 space-y-3">
          <div className="flex items-center gap-2">
            {isGroupMode && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h3 className="text-base font-semibold flex-1">
              {isGroupMode ? "New Group" : "New Message"}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={isGroupMode ? groupName : searchQuery}
              onChange={(e) =>
                isGroupMode
                  ? setGroupName(e.target.value)
                  : setSearchQuery(e.target.value)
              }
              placeholder={
                isGroupMode ? "Group name (optional)" : "Search users..."
              }
              className="w-full h-9 pl-9 pr-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {isUsersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="h-6 w-6" />
            </div>
          ) : filteredUsers && filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center px-4">
              <p className="text-sm text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="space-y-0.5 px-2">
              {!isGroupMode && (
                <NewGroupItem
                  disabled={isCreatingChat}
                  onClick={() => setIsGroupMode(true)}
                />
              )}
              {!isGroupMode
                ? filteredUsers?.map((user) => (
                    <ChatUserItem
                      key={user._id}
                      user={user}
                      isLoading={loadingUserId === user._id}
                      disabled={loadingUserId !== null}
                      onClick={handleCreateChat}
                    />
                  ))
                : filteredUsers?.map((user) => (
                    <GroupUserItem
                      key={user._id}
                      user={user}
                      isSelected={selectedUsers.includes(user._id)}
                      onToggle={toggleUserSelection}
                    />
                  ))}
            </div>
          )}
        </div>

        {isGroupMode && (
          <div className="border-t px-4 py-3">
            <Button
              onClick={handleCreateGroup}
              className="w-full"
              size="sm"
              disabled={isCreatingChat || selectedUsers.length === 0}
            >
              {isCreatingChat ? (
                <>
                  <Spinner className="h-4 w-4 mr-2" />
                  Creating...
                </>
              ) : (
                <>Create Group ({selectedUsers.length})</>
              )}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
});

NewChatPopover.displayName = "NewChatPopover";

const UserAvatar = memo(({ user }: { user: UserType }) => (
  <>
    <AvatarWithBadge name={user.name} src={user?.avatar || ""} size="w-9 h-9" />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium truncate">{user.name}</p>
      <p className="text-xs text-muted-foreground truncate">
        @{user.name.toLowerCase().replace(/\s+/g, "")}
      </p>
    </div>
  </>
));

UserAvatar.displayName = "UserAvatar";

const NewGroupItem = memo(
  ({ disabled, onClick }: { disabled: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-accent transition-all text-left disabled:opacity-50 group"
    >
      <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
        <Users className="h-4 w-4 text-primary" />
      </div>
      <span className="text-sm font-medium">Create New Group</span>
    </button>
  ),
);

NewGroupItem.displayName = "NewGroupItem";

const ChatUserItem = memo(
  ({
    user,
    isLoading,
    disabled,
    onClick,
  }: {
    user: UserType;
    disabled: boolean;
    isLoading: boolean;
    onClick: (id: string) => void;
  }) => (
    <button
      className="relative w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-accent transition-all text-left disabled:opacity-50"
      disabled={isLoading || disabled}
      onClick={() => onClick(user._id)}
    >
      <UserAvatar user={user} />
      {isLoading && <Spinner className="absolute right-3 h-4 w-4" />}
    </button>
  ),
);

ChatUserItem.displayName = "ChatUserItem";

const GroupUserItem = memo(
  ({
    user,
    isSelected,
    onToggle,
  }: {
    user: UserType;
    isSelected: boolean;
    onToggle: (id: string) => void;
  }) => (
    <label
      role="button"
      className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-accent transition-all cursor-pointer"
    >
      <UserAvatar user={user} />
      <Checkbox
        className="ml-auto"
        checked={isSelected}
        onCheckedChange={() => onToggle(user._id)}
      />
    </label>
  ),
);

GroupUserItem.displayName = "GroupUserItem";
