import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import type { MessageType } from "@/types/chat.type";


export const shouldShowTimestamp = (
   currentMessage: MessageType,
   previousMessage: MessageType | null,
): boolean => {
   if (!previousMessage) return true;

   const currentTime = new Date(currentMessage.createdAt);
   const previousTime = new Date(previousMessage.createdAt);

   return differenceInMinutes(currentTime, previousTime) > 10;
};


export const formatTimestamp = (date: Date): string => {
   if (isToday(date)) {
      return format(date, "h:mm a");
   } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, "h:mm a")}`;
   } else {
      return format(date, "MMM d, h:mm a");
   }
};
