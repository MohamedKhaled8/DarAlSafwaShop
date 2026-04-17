import { useLanguage } from "@/contexts/LanguageContext";
import { Globe, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Variant = "default" | "onDark";

export function LanguageSwitcher({ variant = "default" }: { variant?: Variant }) {
  const { language, setLanguage, isRTL, t } = useLanguage();
  const onDark = variant === "onDark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 gap-1.5 rounded-full px-2.5 font-semibold",
            onDark
              ? "text-white hover:bg-white/15 hover:text-white"
              : "text-slate-700 hover:bg-slate-100",
          )}
          aria-label={t("nav.language") as string}
        >
          <Globe className="h-4 w-4 shrink-0 opacity-90" />
          <span className="hidden min-[380px]:inline">{language === "ar" ? "العربية" : "English"}</span>
          <span className="min-[380px]:hidden uppercase">{language}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" align={isRTL ? "start" : "end"}>
        <DropdownMenuRadioGroup
          value={language}
          onValueChange={(v) => setLanguage(v as "ar" | "en")}
        >
          <DropdownMenuRadioItem value="ar" className="font-medium">
            العربية
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en" className="font-medium">
            English
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
