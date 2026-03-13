import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { getNavItems } from "@/lib/navigation";
import { PROTECTED_ROUTES } from "@/routes/routes";
import { useAuth } from "@/hooks/use-auth";
import AvatarWithBadge from "./avatar-with-badge";
import { isUserOnline } from "@/lib/helper";

const MobileAsideBar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = getNavItems(user?._id);
  const isCurrentUserOnline = isUserOnline(user?._id);

  const isActive = (path: string) => {
    if (path === PROTECTED_ROUTES.FEED) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (path: string) => {
    // On mobile, navigate directly to create post page
    if (path === "/create") {
      navigate(PROTECTED_ROUTES.CREATE_POST);
      return;
    }
    navigate(path);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 
             border-t border-border/50 bg-background
             flex items-center justify-around py-2 px-2"
    >
      {[navItems[0], navItems[1], navItems[4], navItems[5]].map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        const isProfileItem = item.label === "Profile";
        return (
          <button
            key={item.label}
            onClick={() => handleNavClick(item.path)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 p-2 rounded-lg flex-1",
              "active:bg-accent",
              active && "bg-accent/70",
            )}
          >
            {isProfileItem ? (
              <AvatarWithBadge
                imageUrl={user?.avatar ?? undefined}
                altText={user?.name}
                fallbackText={user?.name?.charAt(0)?.toUpperCase()}
                size="xs"
                badgeType="status-dot"
                isOnline={isCurrentUserOnline}
                ringClassName={cn(
                  "ring-2 ring-transparent transition-all",
                  active && "ring-primary/30",
                )}
              />
            ) : (
              <Icon
                className={cn("size-6", active && "fill-current")}
                strokeWidth={active ? 2.5 : 2}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default MobileAsideBar;
