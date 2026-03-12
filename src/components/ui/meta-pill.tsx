import type React from "react";
import { cn } from "@/lib/utils";

interface MetaPillProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "soft" | "outline" | "subtle";
}

const variantClasses: Record<NonNullable<MetaPillProps["variant"]>, string> = {
  soft: "bg-muted/55 text-foreground",
  outline:
    "border border-border/60 text-muted-foreground hover:text-foreground",
  subtle: "bg-muted px-2 py-0.5 text-muted-foreground",
};

const MetaPill: React.FC<MetaPillProps> = ({
  children,
  className,
  onClick,
  variant = "soft",
}) => {
  const sharedClassName = cn(
    "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
    variantClasses[variant],
    className,
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={sharedClassName}>
        {children}
      </button>
    );
  }

  return <span className={sharedClassName}>{children}</span>;
};

export default MetaPill;
