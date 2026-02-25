import { useSocket } from "@/hooks/use-socket";
import type { ChatType } from "@/types/chat.type";
import { isToday, format, isYesterday, isThisWeek } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export const isUserOnline = (userId?: string) => {
  if (!userId) return false;
  const { onlineUsers } = useSocket.getState();
  return onlineUsers.includes(userId);
};

export const getOtherUserAndGroup = (
  chat: ChatType,
  currentUserId: string | null,
) => {
  const isGroup = chat?.isGroup;
  if (isGroup) {
    return {
      name: chat?.groupName || "Unnamed Group",
      avatar: chat?.groupImage || "",
      isGroup,
      subheading: `${chat.participants.length} members`,
    };
  }

  const other = chat?.participants.find(
    (participant) => participant._id !== currentUserId,
  );

  const isOnline = isUserOnline(other?._id ?? "");

  return {
    name: other?.name || "Unknown User",
    subheading: isOnline ? "Online" : "Offline",
    avatar: other?.avatar || "",
    isGroup: false,
    isOnline,
  };
};

export const formatChatTime = (date: string | Date) => {
  if (!date) return "";

  const newDate = new Date(date);

  if (isNaN(newDate.getTime())) return "Invalid Date";

  if (isToday(newDate)) {
    return format(newDate, "hh:mm a");
  }

  if (isYesterday(newDate)) {
    return "Yesterday";
  }

  if (isThisWeek(newDate)) {
    return format(newDate, "EEEE");
  }

  return format(newDate, "MM/dd/yyyy");
};

export function generateUUID() {
  return uuidv4();
}