import AppWrapper from "@/components/app-wrapper";
import ChatList from "@/components/chat/chat-list";
import useChatId from "@/hooks/use-chat-id";
import { cn } from "@/lib/utils";
import { Outlet, useLocation } from "react-router-dom";

const AppLayout = () => {
  const chatId = useChatId();
  const location = useLocation();

  // Check if we're on a chat route
  const isChatRoute = location.pathname.startsWith("/chat");

  return (
    <AppWrapper>
      <div className="h-full">
        {/* Show ChatList only on chat routes */}
        {isChatRoute && (
          <div className={cn(chatId ? "hidden lg:block" : "block")}>
            <ChatList />
          </div>
        )}
        <div
          className={cn(
            "flex-1 h-full",
            isChatRoute && "lg:pl-95.75",
            isChatRoute && !chatId && "hidden lg:block",
            isChatRoute && chatId && "block",
          )}
        >
          <Outlet />
        </div>
      </div>
    </AppWrapper>
  );
};

export default AppLayout;
