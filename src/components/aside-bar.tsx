import { useAuth } from "@/hooks/use-auth";
import { isUserOnline } from "@/lib/helper";
import Logo from "@/components/logo";
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
import AvatarWithBadge from "@/components/avatar-with-badge";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getNavItems } from "@/lib/navigation";
import { LogOut, ChevronDown } from "lucide-react";
import { ModeTheme } from "./mode-theme";

const AsideBar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isOnline = isUserOnline(user?._id);
  const navItems = getNavItems(user?._id);

  const isActive = (path: string) => {
    if (path === PROTECTED_ROUTES.FEED) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (path: string) => {
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
          <div className="flex items-center gap-2">
            <Logo
              url={PROTECTED_ROUTES.FEED}
              imgClass="size-7"
              textClass="text-foreground text-xl font-bold"
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

            // Regular navigation button
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.path)}
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
                <span className="hidden lg:block text-base">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="hidden lg:block ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-4 px-2 lg:px-3 py-3 mx-2 lg:mx-0 rounded-lg transition-all hover:bg-accent">
              <AvatarWithBadge
                name={user?.name || "Unknown"}
                src={user?.avatar ?? undefined}
                isOnline={isOnline}
              />
              <span className="hidden lg:block text-base font-semibold truncate flex-1 text-left">
                {user?.name}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            align="end"
            side="right"
            sideOffset={8}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>

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
