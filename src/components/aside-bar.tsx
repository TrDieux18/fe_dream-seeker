import { isUserOnline } from "@/lib/helper";
import Logo from "@/components/logo";
import AvatarWithBadge from "@/components/avatar-with-badge";
import { PROTECTED_ROUTES } from "@/routes/routes";
import MobileAsideBar from "@/components/mobile-aside-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getNavItems } from "@/lib/navigation";
import { LogOut, ChevronDown, User } from "lucide-react";
import { ModeTheme } from "./mode-theme";
import { useAuth } from "@/hooks/use-auth";
import { useSocket } from "@/hooks/use-socket";

const AsideBar = () => {
  const { user, logout } = useAuth();
  const { unreadNotificationCount, clearUnreadNotifications } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = getNavItems(user?._id, unreadNotificationCount);
  const isCurrentUserOnline = isUserOnline(user?._id);

  const isActive = (path: string) => {
    if (path === PROTECTED_ROUTES.FEED) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (path: string) => {
    if (path === PROTECTED_ROUTES.NOTIFICATIONS) {
      clearUnreadNotifications();
    }
    navigate(path);
  };

  return (
    <>
      <aside
        className="hidden md:flex fixed inset-y-0 left-0 z-50 
          w-16 lg:w-60 border-r border-border/50 bg-background
          flex-col justify-between py-6"
      >
        <div className="px-3 lg:px-6">
          <div
            className="flex items-center gap-2 hover:cursor-pointer "
            onClick={() => navigate(PROTECTED_ROUTES.FEED)}
          >
            <Logo
              url={PROTECTED_ROUTES.FEED}
              imgClass="size-7"
              textClass="text-foreground text-xl font-bold "
              showText={false}
            />
            <span className="hidden lg:block font-bold text-xl">
              Dream Seeker.
            </span>
          </div>
        </div>

        <nav className="flex-1 px-2 lg:px-3 mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const isProfileItem = item.label === "Profile";

            if (item.children && item.children.length > 0) {
              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all",
                        "hover:bg-accent",
                        active && "font-bold",
                      )}
                    >
                      <Icon
                        className={cn("size-7 shrink-0", active && "font-bold")}
                        strokeWidth={active ? 2.5 : 2}
                      />
                      <span className="hidden lg:block text-base flex-1 text-left">
                        {item.label}
                      </span>
                      <ChevronDown className="hidden lg:block size-4 shrink-0" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56"
                    align="start"
                    side="right"
                    sideOffset={8}
                  >
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <DropdownMenuItem
                          key={child.label}
                          onClick={() => handleNavClick(child.path)}
                        >
                          <ChildIcon className="mr-2 size-4" />
                          {child.label}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.path)}
                className={cn(
                  "w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all",
                  "hover:bg-accent",
                  active && "bg-accent/70 font-bold",
                )}
              >
                {isProfileItem ? (
                  <AvatarWithBadge
                    imageUrl={user?.avatar ?? undefined}
                    altText={user?.name}
                    fallbackText={user?.name?.charAt(0)?.toUpperCase()}
                    className="h-8 w-8 shrink-0"
                    ringClassName={cn(
                      "ring-2 ring-transparent transition-all",
                      active && "ring-primary/25",
                    )}
                  />
                ) : (
                  <div className="relative shrink-0">
                    <Icon
                      className={cn("size-7", active && "font-bold")}
                      strokeWidth={active ? 2.5 : 2}
                    />
                    {item.label === "Notifications" && !!item.badge && (
                      <span className="absolute right-0 -top-1 flex min-w-4 h-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </div>
                )}
                <span className="hidden lg:block text-base">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="mx-2 lg:mx-3 flex items-center justify-center lg:justify-start gap-3 rounded-2xl border border-border/60 bg-muted/30 px-2 lg:px-3 py-2.5 transition-all hover:border-border hover:bg-accent/70">
              <AvatarWithBadge
                imageUrl={user?.avatar ?? undefined}
                altText={user?.name}
                fallbackText={user?.name?.charAt(0)?.toUpperCase()}
                size="sm"
                badgeType="status-dot"
                isOnline={isCurrentUserOnline}
                ringClassName="ring-2 ring-background"
              />
              <div className="hidden min-w-0 flex-1 lg:flex lg:flex-col lg:text-left">
                <span className="truncate text-sm font-semibold text-foreground">
                  {user?.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.username}
                </span>
              </div>
              <ChevronDown className="hidden size-4 shrink-0 text-muted-foreground lg:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-72 rounded-2xl border-border/60 p-2"
            align="end"
            side="right"
            sideOffset={8}
          >
            <DropdownMenuLabel className="font-normal px-1 py-1">
              <div className="flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-3">
                <AvatarWithBadge
                  imageUrl={user?.avatar ?? undefined}
                  altText={user?.name}
                  fallbackText={user?.name?.charAt(0)?.toUpperCase()}
                  size="md"
                  badgeType="status-dot"
                  isOnline={isCurrentUserOnline}
                  ringClassName="ring-2 ring-background"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user?.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.username}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() =>
                handleNavClick(
                  PROTECTED_ROUTES.PROFILE_BY_ID.replace(
                    ":userId",
                    user?._id || "",
                  ),
                )
              }
            >
              <User className="mr-2 size-4" />
              View profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <ModeTheme />

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={logout} variant="destructive">
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </aside>

      <MobileAsideBar />
    </>
  );
};

export default AsideBar;
