import { Outlet, Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const AdminLayout = () => {
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();

  const isActive = (path: string) => {
    return location.pathname === path ? "bg-primary/10 text-primary font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-800";
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-center">
          <h2 className="text-2xl font-bold text-gradient-primary tracking-tight">{t("admin.title") as string}</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <Link to="/admin" className={`block px-4 py-2.5 rounded-md transition-colors ${isActive('/admin')}`}>
            {t("admin.overview") as string}
          </Link>
          <Link to="/admin/products" className={`block px-4 py-2.5 rounded-md transition-colors ${isActive('/admin/products')}`}>
            {t("admin.products") as string}
          </Link>
          <Link to="/admin/orders" className={`block px-4 py-2.5 rounded-md transition-colors ${isActive('/admin/orders')}`}>
            {t("admin.orders") as string}
          </Link>
          <Link to="/admin/customers" className={`block px-4 py-2.5 rounded-md transition-colors ${isActive('/admin/customers')}`}>
            {t("admin.customers") as string}
          </Link>
          <Link to="/admin/categories" className={`block px-4 py-2.5 rounded-md transition-colors ${isActive('/admin/categories')}`}>
            {t("admin.categories") as string}
          </Link>
          <Link to="/admin/analytics" className={`block px-4 py-2.5 rounded-md transition-colors ${isActive('/admin/analytics')}`}>
            {t("admin.analytics") as string}
          </Link>
          <Link to="/admin/printing" className={`block px-4 py-2.5 rounded-md transition-colors ${isActive('/admin/printing')}`}>
            {t("admin.printingSetup") as string}
          </Link>
          <Link to="/admin/gifts" className={`block px-4 py-2.5 rounded-md transition-colors ${isActive('/admin/gifts')}`}>
            {t("admin.giftsSetup") as string}
          </Link>
          <Link to="/admin/shipping" className={`block px-4 py-2.5 rounded-md transition-colors ${isActive('/admin/shipping')}`}>
            {t("adminShipping.title") as string}
          </Link>
          
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
            {/* Language Selector for Admin */}
            <div className="px-4 py-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{(t("language.title") as string) || "Language"}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage("ar")}
                  className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
                    language === "ar" 
                      ? "bg-primary text-white" 
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  العربية
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
                    language === "en" 
                      ? "bg-primary text-white" 
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  English
                </button>
              </div>
            </div>
            
            <Link to="/admin/seed" className={`block px-4 py-2.5 rounded-md transition-colors ${isActive('/admin/seed')}`}>
              {t("admin.seedData") as string}
            </Link>
            <Link to="/admin/settings" className={`block px-4 py-2.5 rounded-md transition-colors ${isActive('/admin/settings')}`}>
              {t("admin.settings") as string}
            </Link>
            <Link to="/" className="block mt-2 px-4 py-2.5 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/50">
              {t("admin.returnToStore") as string}
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full p-8">
        <div className="max-w-6xl mx-auto pb-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
