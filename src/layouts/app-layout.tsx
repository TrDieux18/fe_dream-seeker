import AppWrapper from "@/components/app-wrapper";
import ChatList from "@/components/chat/chat-list";
import useChatId from "@/hooks/use-chat-id";
import { cn } from "@/lib/utils";
import { Outlet, useLocation } from "react-router-dom";

const AppLayout = () => {
  const chatId = useChatId();
  const location = useLocation();

  const isChatRoute = location.pathname.startsWith("/chat");

  return (
    <AppWrapper>
      <div className="relative h-full min-h-svh">
        {/* Show ChatList only on chat routes */}
        {isChatRoute && (
          <div className={cn(chatId ? "hidden lg:block" : "block")}>
            <ChatList />
          </div>
        )}
        <div
          className={cn(
            "flex-1 h-full min-h-svh",
            isChatRoute && "lg:ml-95.75",
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
