import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage, isRTL } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-secondary transition-colors text-sm font-medium"
      title={isRTL ? "Switch to English" : "التبديل للعربية"}
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase">{language}</span>
    </button>
  );
}
