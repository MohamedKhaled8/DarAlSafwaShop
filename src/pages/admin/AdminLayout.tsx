import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AdminLayout = () => {
  const location = useLocation();
  const { t, language, setLanguage, isRTL } = useLanguage();
  const [sheetOpen, setSheetOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path ? "bg-primary/10 text-primary font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-800";

  const linkClass = (path: string) =>
    cn("block px-4 py-2.5 rounded-md transition-colors", isActive(path));

  const NavBody = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      <Link to="/admin" className={linkClass("/admin")} onClick={onNavigate}>
        {t("admin.overview") as string}
      </Link>
      <Link to="/admin/products" className={linkClass("/admin/products")} onClick={onNavigate}>
        {t("admin.products") as string}
      </Link>
      <Link to="/admin/orders" className={linkClass("/admin/orders")} onClick={onNavigate}>
        {t("admin.orders") as string}
      </Link>
      <Link to="/admin/customers" className={linkClass("/admin/customers")} onClick={onNavigate}>
        {t("admin.customers") as string}
      </Link>
      <Link to="/admin/categories" className={linkClass("/admin/categories")} onClick={onNavigate}>
        {t("admin.categories") as string}
      </Link>
      <Link to="/admin/analytics" className={linkClass("/admin/analytics")} onClick={onNavigate}>
        {t("admin.analytics") as string}
      </Link>
      <Link to="/admin/gifts" className={linkClass("/admin/gifts")} onClick={onNavigate}>
        {t("admin.giftsSetup") as string}
      </Link>
      <Link to="/admin/shipping" className={linkClass("/admin/shipping")} onClick={onNavigate}>
        {t("adminShipping.title") as string}
      </Link>

      <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="px-4 py-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{(t("language.title") as string) || "Language"}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLanguage("ar")}
              className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
                language === "ar" ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              العربية
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
                language === "en" ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              English
            </button>
          </div>
        </div>

        <Link to="/admin/seed" className={linkClass("/admin/seed")} onClick={onNavigate}>
          {t("admin.seedData") as string}
        </Link>
        <Link to="/admin/settings" className={linkClass("/admin/settings")} onClick={onNavigate}>
          {t("admin.settings") as string}
        </Link>
        <Link
          to="/"
          className="block mt-2 px-4 py-2.5 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/50"
          onClick={onNavigate}
        >
          {t("admin.returnToStore") as string}
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 lg:flex-row">
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <header className="flex shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950 lg:hidden">
          <SheetTrigger asChild>
            <Button type="button" variant="outline" size="icon" className="shrink-0" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <h2 className="min-w-0 flex-1 truncate text-center text-base font-bold text-gradient-primary">{t("admin.title") as string}</h2>
        </header>

        <SheetContent
          side={isRTL ? "right" : "left"}
          className="flex w-[min(20rem,92vw)] max-w-[92vw] flex-col gap-0 p-0 lg:hidden [&>button]:end-3 [&>button]:start-auto [&>button]:top-3"
        >
          <SheetTitle className="sr-only">{t("admin.title") as string}</SheetTitle>
          <div className="border-b border-gray-200 px-4 py-4 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gradient-primary">{t("admin.title") as string}</h2>
          </div>
          <nav className="min-h-0 flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden p-4">
            <NavBody onNavigate={() => setSheetOpen(false)} />
          </nav>
        </SheetContent>
      </Sheet>

      <aside className="hidden w-64 shrink-0 flex-col border-e border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 lg:flex">
        <div className="flex items-center justify-center border-b border-gray-200 p-6 dark:border-gray-800">
          <h2 className="text-2xl font-bold tracking-tight text-gradient-primary">{t("admin.title") as string}</h2>
        </div>
        <nav className="min-h-0 flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden p-4">
          <NavBody />
        </nav>
      </aside>

      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl pb-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
