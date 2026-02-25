import SignInPage from "@/pages/auth/sign-in";
import SignUpPage from "@/pages/auth/sign-up";
import ChatPage from "@/pages/chat";
import SingleChatPage from "@/pages/chat/chatId";
import FeedPage from "@/pages/feed";
import ExplorePage from "@/pages/explore";
import SearchPage from "@/pages/search";
import NotificationsPage from "@/pages/notifications";
import CreatePage from "@/pages/create";
import ProfilePage from "@/pages/profile";

export const AUTH_ROUTES = {
  SIGN_IN: "/",
  SIGN_UP: "/sign-up",
};

export const PROTECTED_ROUTES = {
  CHAT: "/chat",
  CHAT_BY_ID: "/chat/:chatId",
  FEED: "/feed",
  EXPLORE: "/explore",
  SEARCH: "/search",
  NOTIFICATIONS: "/notifications",
  CREATE_POST: "/create/post",
  PROFILE: "/profile",
  PROFILE_BY_ID: "/profile/:userId",
};

export const authRoutesPaths = [
  {
    path: AUTH_ROUTES.SIGN_IN,
    element: <SignInPage />,
  },
  {
    path: AUTH_ROUTES.SIGN_UP,
    element: <SignUpPage />,
  },
];
export const protectedRoutesPaths = [
  {
    path: PROTECTED_ROUTES.CHAT,
    element: <ChatPage />,
  },
  {
    path: PROTECTED_ROUTES.CHAT_BY_ID,
    element: <SingleChatPage />,
  },
  {
    path: PROTECTED_ROUTES.FEED,
    element: <FeedPage />,
  },
  {
    path: PROTECTED_ROUTES.EXPLORE,
    element: <ExplorePage />,
  },
  {
    path: PROTECTED_ROUTES.SEARCH,
    element: <SearchPage />,
  },
  {
    path: PROTECTED_ROUTES.NOTIFICATIONS,
    element: <NotificationsPage />,
  },
  {
    path: PROTECTED_ROUTES.CREATE_POST,
    element: <CreatePage />,
  },
  {
    path: PROTECTED_ROUTES.PROFILE,
    element: <ProfilePage />,
  },
  {
    path: PROTECTED_ROUTES.PROFILE_BY_ID,
    element: <ProfilePage />,
  },
];

export const isAuthRoute = (path: string) => {
  return Object.values(AUTH_ROUTES).includes(path);
};
