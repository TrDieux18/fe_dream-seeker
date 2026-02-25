import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { CheckCircle2, Users } from "lucide-react";
import groupImg from "@/assets/group-img.png";

// Type definitions for better type safety and IntelliSense
type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
type BadgeType =
  | "status-dot"
  | "notification-count"
  | "verified-icon"
  | "custom"
  | "none";
type BadgePosition = "top-right" | "bottom-right" | "top-left" | "bottom-left";

interface AvatarWithBadgeProps {
  // Core avatar props (NEW API)
  imageUrl?: string;
  altText?: string;
  fallbackText?: string; // For initials, defaults to first char of altText

  // Backwards compatibility (OLD API) - deprecated but supported
  /** @deprecated Use imageUrl instead */
  src?: string;
  /** @deprecated Use altText instead */
  name?: string;

  // Sizing
  size?: AvatarSize | string; // Supports both new enum and old Tailwind classes

  // Badge configuration
  badgeType?: BadgeType;
  badgeContent?: string | number; // For notification count or custom content
  badgePosition?: BadgePosition;

  // Status and variants
  isOnline?: boolean; // For status-dot badge
  isGroup?: boolean; // Uses group placeholder if no imageUrl
  isVerified?: boolean; // Shows verified checkmark

  // Styling
  className?: string;
  ringClassName?: string; // Custom ring styling (e.g., for active state)
}

// Size configuration with avatar and badge dimensions
const SIZE_CONFIG: Record<
  AvatarSize,
  {
    avatar: string;
    badge: string;
    badgeOffset: string;
    fontSize: string;
    notificationFontSize: string;
  }
> = {
  xs: {
    avatar: "w-8 h-8",
    badge: "w-2 h-2",
    badgeOffset: "0px",
    fontSize: "text-xs",
    notificationFontSize: "text-[9px]",
  },
  sm: {
    avatar: "w-10 h-10",
    badge: "w-2.5 h-2.5",
    badgeOffset: "1px",
    fontSize: "text-sm",
    notificationFontSize: "text-[10px]",
  },
  md: {
    avatar: "w-12 h-12",
    badge: "w-3 h-3",
    badgeOffset: "1px",
    fontSize: "text-base",
    notificationFontSize: "text-xs",
  },
  lg: {
    avatar: "w-16 h-16",
    badge: "w-3.5 h-3.5",
    badgeOffset: "2px",
    fontSize: "text-lg",
    notificationFontSize: "text-xs",
  },
  xl: {
    avatar: "w-20 h-20",
    badge: "w-4 h-4",
    badgeOffset: "2px",
    fontSize: "text-xl",
    notificationFontSize: "text-sm",
  },
  "2xl": {
    avatar: "w-24 h-24",
    badge: "w-5 h-5",
    badgeOffset: "3px",
    fontSize: "text-2xl",
    notificationFontSize: "text-sm",
  },
};

// Badge position classes
const BADGE_POSITION_CLASSES: Record<BadgePosition, string> = {
  "top-right": "top-0 right-0",
  "bottom-right": "bottom-0 right-0",
  "top-left": "top-0 left-0",
  "bottom-left": "bottom-0 left-0",
};

// Helper to map old size strings to new size enum
const mapLegacySizeToEnum = (size: string): AvatarSize => {
  if (size.includes("w-8") || size.includes("h-8")) return "xs";
  if (
    size.includes("w-9") ||
    size.includes("w-10") ||
    size.includes("h-9") ||
    size.includes("h-10")
  )
    return "sm";
  if (
    size.includes("w-11") ||
    size.includes("w-12") ||
    size.includes("h-11") ||
    size.includes("h-12")
  )
    return "md";
  if (
    size.includes("w-13") ||
    size.includes("w-14") ||
    size.includes("w-15") ||
    size.includes("w-16")
  )
    return "lg";
  if (size.includes("w-20") || size.includes("h-20")) return "xl";
  if (size.includes("w-24") || size.includes("h-24")) return "2xl";
  return "md"; // default
};

const AvatarWithBadge: React.FC<AvatarWithBadgeProps> = ({
  // New API props
  imageUrl,
  altText,
  fallbackText,

  // Old API props (backwards compatibility)
  src,
  name,

  size = "md",
  badgeType,
  badgeContent,
  badgePosition = "bottom-right",
  isOnline = false,
  isGroup = false,
  isVerified = false,
  className,
  ringClassName,
}) => {
  // Backwards compatibility: use old props if new ones aren't provided
  const actualImageUrl = imageUrl ?? src;
  const actualAltText = altText ?? name ?? "User";

  // Handle size: if it's a string with Tailwind classes, map it; otherwise use as-is
  const sizeKey =
    typeof size === "string" && (size.includes("w-") || size.includes("h-"))
      ? mapLegacySizeToEnum(size)
      : (size as AvatarSize);

  const sizeConfig = SIZE_CONFIG[sizeKey];

  // Determine actual image URL with fallback logic
  const finalImageUrl = isGroup ? actualImageUrl || groupImg : actualImageUrl;

  // Generate fallback text (initials)
  const initials =
    fallbackText || actualAltText?.charAt(0)?.toUpperCase() || "?";

  // Auto-detect badge type based on props (backwards compatibility)
  const effectiveBadgeType = badgeType
    ? badgeType
    : isOnline && !isGroup
      ? "status-dot"
      : "none";

  // Determine which badge to show
  const shouldShowBadge = effectiveBadgeType !== "none" || isVerified;

  // Render badge based on type
  const renderBadge = () => {
    // Verified badge takes priority
    if (isVerified || effectiveBadgeType === "verified-icon") {
      return (
        <div
          className={cn(
            "absolute flex items-center justify-center rounded-full",
            "bg-blue-500 ring-2 ring-background",
            sizeConfig.badge,
            BADGE_POSITION_CLASSES[badgePosition],
          )}
          aria-label="Verified"
        >
          <CheckCircle2 className="w-full h-full p-0.5 text-white" />
        </div>
      );
    }

    // Status dot badge
    if (effectiveBadgeType === "status-dot" && !isGroup) {
      return (
        <span
          className={cn(
            "absolute rounded-full ring-2 ring-background",
            isOnline ? "bg-green-500" : "bg-gray-400",
            sizeConfig.badge,
            BADGE_POSITION_CLASSES[badgePosition],
          )}
          aria-label={isOnline ? "Online" : "Offline"}
        />
      );
    }

    // Notification count badge
    if (effectiveBadgeType === "notification-count" && badgeContent) {
      const count =
        typeof badgeContent === "number"
          ? badgeContent
          : parseInt(badgeContent, 10);
      const displayCount = count > 99 ? "99+" : count;

      return (
        <div
          className={cn(
            "absolute flex items-center justify-center rounded-full",
            "bg-red-500 ring-2 ring-background",
            "min-w-5 h-5 px-1",
            sizeConfig.notificationFontSize,
            "font-bold text-white",
            BADGE_POSITION_CLASSES[badgePosition],
          )}
          aria-label={`${count} notifications`}
        >
          {displayCount}
        </div>
      );
    }

    // Custom badge content
    if (effectiveBadgeType === "custom" && badgeContent) {
      return (
        <div
          className={cn(
            "absolute flex items-center justify-center rounded-full",
            "bg-primary ring-2 ring-background",
            "px-1.5 py-0.5",
            sizeConfig.notificationFontSize,
            "font-medium text-primary-foreground",
            BADGE_POSITION_CLASSES[badgePosition],
          )}
        >
          {badgeContent}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative inline-block shrink-0">
      <Avatar
        className={cn(
          sizeConfig.avatar,
          ringClassName && ringClassName,
          className,
        )}
      >
        <AvatarImage
          src={finalImageUrl}
          alt={actualAltText}
          className="object-cover"
        />
        <AvatarFallback
          className={cn(
            "bg-primary/10 text-primary font-semibold",
            sizeConfig.fontSize,
          )}
        >
          {isGroup && !actualImageUrl ? (
            <Users className="w-1/2 h-1/2" />
          ) : (
            initials
          )}
        </AvatarFallback>
      </Avatar>

      {shouldShowBadge && renderBadge()}
    </div>
  );
};

export default AvatarWithBadge;
