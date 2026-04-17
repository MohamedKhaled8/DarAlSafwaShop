import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

type Variant = "default" | "onDark";

export function ThemeSwitcher({ variant = "default" }: { variant?: Variant }) {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const { t, isRTL } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const onDark = variant === "onDark";
  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 w-9 shrink-0 rounded-full p-0",
            onDark
              ? "text-white hover:bg-white/15 hover:text-white"
              : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
          )}
          aria-label={t("theme.label") as string}
        >
          {!mounted ? (
            <Sun className="h-4 w-4 opacity-50" />
          ) : isDark ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" align={isRTL ? "start" : "end"}>
        <DropdownMenuRadioGroup value={theme ?? "system"} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light" className="gap-2 font-medium">
            <Sun className="h-4 w-4" />
            {t("theme.light") as string}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" className="gap-2 font-medium">
            <Moon className="h-4 w-4" />
            {t("theme.dark") as string}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" className="gap-2 font-medium">
            <Monitor className="h-4 w-4" />
            {t("theme.system") as string}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
