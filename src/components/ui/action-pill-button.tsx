import type React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ActionPillButtonProps {
  children: React.ReactNode;
  label?: string;
  active?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const ActionPillButton: React.FC<ActionPillButtonProps> = ({
  children,
  label,
  active = false,
  className,
  disabled,
  onClick,
}) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size={label ? "sm" : "icon"}
      className={cn(
        "h-10 rounded-full border border-border/60 px-3 transition-all hover:bg-muted/70",
        label ? "" : "w-10 px-0",
        active ? "bg-muted/70 text-foreground" : "bg-muted/40",
        className,
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
      {label && <span className="ml-1 text-sm font-medium">{label}</span>}
    </Button>
  );
};

export default ActionPillButton;
