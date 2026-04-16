import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, ShoppingCart, User, Menu, X, Heart,
  BookOpen, GraduationCap, Laptop, Gamepad2, Gift,
  Palette, PenTool, Printer, Sparkles, ChevronDown,
  ArrowRight, MapPin, Phone, Mail, LogOut
} from "lucide-react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { useCartContext } from "@/contexts/CartContext";
import { useCategories, useProducts } from "@/hooks/useProducts";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const iconMap: Record<string, React.ElementType> = {
  BookOpen, GraduationCap, Laptop, Gamepad2, Gift, Palette, PenTool,
};

// Dar Al Safwa Logo Component
const DarAlSafwaLogo = () => (
  <motion.div 
    className="flex items-center gap-2"
    whileHover={{ scale: 1.02 }}
  >
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-200">
      <BookOpen className="w-5 h-5 text-white" />
    </div>
    <span className="font-bold text-xl text-slate-800">دار الصفوة</span>
  </motion.div>
);

const HighlightText = ({ text, query }: { text: string; query: string }) => {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-emerald-600 font-semibold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
};

const Navbar = () => {
  const { t } = useLanguage();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { cartCount, wishlist } = useCartContext();
  const { categories } = useCategories();
  const { products: catalogProducts } = useProducts(120);
  const searchRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const prevCartCount = useRef(cartCount);
  const [cartBounce, setCartBounce] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 50));

  useEffect(() => {
    if (cartCount > prevCartCount.current) {
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 600);
    }
    prevCartCount.current = cartCount;
  }, [cartCount]);

  const suggestions = searchQuery.length > 1
    ? catalogProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6)
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setActiveCategory(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleSuggestionClick = useCallback((id: string) => {
    navigate(`/product/${id}`);
    setSearchFocused(false);
    setSearchQuery("");
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      setUserOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isHome = window.location.pathname === "/";

  return (
    <>
      {/* Main Header - Clean White */}
      <motion.header
        className={`fixed left-0 right-0 top-0 z-40 transition-all duration-500 ${
          isHome && !scrolled ? "bg-transparent" : "bg-white shadow-sm"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.36, 1] }}
      >
        <div 
          className={`transition-all duration-500 ${
            isHome && !scrolled ? "bg-transparent border-transparent" : "bg-white border-b border-slate-100 shadow-sm"
          }`}
        >
          <div className="section-padding">
            <div className={`flex flex-row items-center gap-6 transition-all duration-300 ${scrolled ? "h-16" : "h-20"}`}>
              
              {/* LEFT: Account & Icons (Leftmost in RTL) */}
              <div className="flex items-center gap-2 shrink-0">
                <div ref={userRef} className="relative">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUserOpen(!userOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${
                      isHome && !scrolled 
                        ? "bg-white/10 text-white hover:bg-white/20" 
                        : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{t("nav.account") as string}</span>
                  </motion.button>
                  <AnimatePresence>
                    {userOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-[9999] origin-top-right"
                      >
                        <div className="p-2">
                          {user ? (
                            <>
                              {[
                                { label: t("nav.account") as string, icon: User, to: "/dashboard" },
                                { label: isAdmin ? (t("admin.orders") as string) : (t("nav.orders") as string), icon: ShoppingCart, to: isAdmin ? "/admin/orders" : "/my-orders" },
                                { label: t("nav.wishlist") as string, icon: Heart, to: "/dashboard?tab=wishlist" },
                              ].map((item) => (
                                <Link
                                  key={String(item.label)}
                                  to={item.to}
                                  onClick={() => setUserOpen(false)}
                                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 transition-colors"
                                >
                                  <item.icon className="w-5 h-5 text-slate-500" />
                                  <span className="text-sm font-bold text-slate-700 text-right w-full">{item.label}</span>
                                </Link>
                              ))}
                              <div className="border-t border-slate-100 my-2" />
                              <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-50 transition-colors w-full text-right"
                              >
                                <LogOut className="w-5 h-5 text-rose-500" />
                                <span className="text-sm font-bold text-rose-600">{t("nav.signOut") as string}</span>
                              </button>
                            </>
                          ) : (
                            <Link
                              to="/login"
                              onClick={() => setUserOpen(false)}
                              className="flex items-center gap-3 px-3 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors w-full"
                            >
                              <User className="w-4 h-4" />
                              <span className="text-sm font-bold">{t("nav.signIn") as string}</span>
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link 
                  to="/cart" 
                  className={`relative p-2.5 rounded-full transition-all group ${
                    isHome && !scrolled ? "bg-white/10 text-white hover:bg-white/20" : "bg-slate-100 text-slate-600 hover:bg-emerald-50"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                </Link>
              </div>

              {/* CENTER: Navigation Links */}
              <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center px-4" ref={categoryRef}>
                <Link 
                  to="/" 
                  className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                    isHome && !scrolled ? "text-white hover:bg-white/10" : "text-slate-700 hover:text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  {t("nav.home") as string}
                </Link>
                <div className="relative">
                  <button 
                    onClick={() => setActiveCategory(activeCategory ? null : "categories")}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                      isHome && !scrolled ? "text-white hover:bg-white/10" : "text-slate-700 hover:text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {t("nav.categories") as string}
                    <ChevronDown className={`w-4 h-4 transition-transform ${activeCategory === "categories" ? "rotate-180" : ""}`} />
                  </button>
                </div>
                {/* Categories Dropdown Panel */}
                <AnimatePresence>
                  {activeCategory === "categories" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 right-0 w-64 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-[9999]"
                    >
                      <div className="p-2">
                        {categories.filter(c => c?.id).length === 0 ? (
                          <p className="text-sm text-slate-400 text-center py-4">{t("nav.noCategories") as string}</p>
                        ) : (
                          categories.filter(c => c?.id).map((cat) => {
                            const Icon = iconMap[cat.icon] || BookOpen;
                            return (
                              <Link
                                key={cat.id}
                                to={`/category/${cat.slug || cat.id}`}
                                onClick={() => setActiveCategory(null)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 transition-colors"
                              >
                                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                                  <Icon className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                  <span className="text-sm font-bold text-slate-700">{cat.name}</span>
                                  {cat.count > 0 && <span className="text-xs text-slate-400 mr-2">({cat.count})</span>}
                                </div>
                              </Link>
                            );
                          })
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <Link 
                  to="/printing" 
                  className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                    isHome && !scrolled ? "text-white hover:bg-white/10" : "text-slate-700 hover:text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  {t("top.printing") as string}
                </Link>
                <Link 
                  to={isAdmin ? "/admin/orders" : "/my-orders"}
                  className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                    isHome && !scrolled ? "text-white hover:bg-white/10" : "text-slate-700 hover:text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  {isAdmin ? (t("admin.orders") as string) : (t("nav.myOrdersStatus") as string)}
                </Link>
              </nav>

              {/* RIGHT: Logo (Rightmost in RTL) */}
              <Link to="/" className="shrink-0">
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className={`font-black text-xl transition-colors hidden md:block ${
                    isHome && !scrolled ? "text-white" : "text-slate-800"
                  }`}>{t("app.name") as string}</span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all ${
                    isHome && !scrolled ? "bg-white/10 backdrop-blur-md" : "bg-emerald-600 shadow-xl"
                  }`}>
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
              </Link>

              {/* MOBILE: Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${isHome && !scrolled ? "text-white hover:bg-white/10" : "text-slate-700"}`}
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Spacer */}
      {!isHome && <div className={`transition-all duration-300 ${scrolled ? "h-16" : "h-20"}`} />}

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {searchFocused && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setSearchFocused(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-4 right-4 z-[70] md:hidden"
            >
              <div className="bg-white rounded-2xl shadow-xl p-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t("nav.search") as string}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-100 text-sm focus:outline-none"
                  />
                </div>
                {suggestions.length > 0 && (
                  <div className="mt-2 max-h-[60vh] overflow-y-auto">
                    {suggestions.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSuggestionClick(p.id)}
                        className="flex items-center gap-3 w-full px-3 py-2 hover:bg-emerald-50 rounded-xl text-left"
                      >
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="text-sm text-slate-700">{p.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 z-[90] w-[300px] bg-white shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <DarAlSafwaLogo />
                  <button 
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 font-medium"
                >
                  {t("nav.home") as string}
                </Link>

                <p className="text-xs font-medium text-slate-400 uppercase px-4 pt-4 pb-2">
                  {t("nav.categories") as string}
                </p>
                {categories.filter(c => c?.id).map((cat, i) => {
                  const Icon = iconMap[cat.icon] || BookOpen;
                  return (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={`/category/${cat.slug || cat.id}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-slate-700">{cat.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <Link
                    to="/printing"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <Printer className="w-5 h-5 text-slate-500" />
                    <span className="text-slate-700">{t("top.printing") as string}</span>
                  </Link>
                  <Link
                    to="/gifts"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <Sparkles className="w-5 h-5 text-slate-500" />
                    <span className="text-slate-700">{t("top.gifts") as string}</span>
                  </Link>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-600 text-white mb-2"
                      >
                        <User className="w-5 h-5" />
                        <span>{t("nav.account") as string}</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-200 text-red-600 w-full"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>{t("nav.signOut") as string}</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-600 text-white"
                    >
                      <User className="w-5 h-5" />
                      <span>{t("nav.signIn") as string}</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
