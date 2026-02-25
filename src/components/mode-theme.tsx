import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Monitor } from "lucide-react";

const themeConfig = {
  light: { label: "Light", icon: Sun },
  dark: { label: "Dark", icon: Moon },
  system: { label: "System", icon: Monitor },
};

export function ModeTheme() {
  const { theme, setTheme } = useTheme();
  const ThemeIcon = themeConfig[theme].icon;

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <ThemeIcon className="mr-2 size-4" />
        <span>Theme</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {themeConfig[theme].label}
        </span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) =>
            setTheme(value as "light" | "dark" | "system")
          }
        >
          <DropdownMenuRadioItem value="light">
            <Sun className="mr-2 size-4" />
            Sáng
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon className="mr-2 size-4" />
            Tối
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Monitor className="mr-2 size-4" />
            Hệ thống
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
