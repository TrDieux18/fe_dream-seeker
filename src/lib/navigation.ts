import {
   Home,
   Search,
   Compass,
   MessageCircle,
   Bell,
   PlusSquare,
   User,
   Sparkles,
   ImagePlus,
} from "lucide-react";
import { PROTECTED_ROUTES } from "@/routes/routes";

export interface NavItem {
   label: string;
   icon: React.ElementType;
   path: string;
   badge?: number;
   children?: NavItem[];
}

export const getNavItems = (userId?: string): NavItem[] => [
   { label: "Home", icon: Home, path: PROTECTED_ROUTES.FEED },
   { label: "Search", icon: Search, path: PROTECTED_ROUTES.SEARCH },
   { label: "Explore", icon: Compass, path: PROTECTED_ROUTES.EXPLORE },
   { label: "Messages", icon: MessageCircle, path: PROTECTED_ROUTES.CHAT },
   {
      label: "Notifications",
      icon: Bell,
      path: PROTECTED_ROUTES.NOTIFICATIONS,
   },
   {
      label: "Create",
      icon: PlusSquare,
      path: "/create",
      children: [
         { label: "Create Post", icon: ImagePlus, path: PROTECTED_ROUTES.CREATE_POST },
         { label: "AI", icon: Sparkles, path: "/create/ai" },
      ]
   },
   { label: "Profile", icon: User, path: `/profile/${userId}` },
];
