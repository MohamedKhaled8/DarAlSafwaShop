import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart, Star, ChevronLeft, ChevronRight,
  ArrowRight, ArrowUp, Zap, TrendingUp, Package,
  Search, ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartContext } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { resolveCategoryName } from "@/lib/localizedContent";
import { seedProducts, seedCategories } from "@/data/seedData";
import type { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useProducts, useCategories } from "@/hooks/useProducts";

const HERO_SLIDES = [
  {
    tag: "عرض لفترة محدودة",
    title: "مجموعة العودة <br/> للمدارس 2024",
    subtitle: "كل ما يحتاجه طفلك في مكان واحد بخصومات تصل لـ 50%",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    bg: "bg-[#fde047]", // Noon Yellow
    text: "text-slate-900",
    btnColor: "bg-slate-900 text-white"
  },
  {
    tag: "إصدارات جديدة",
    title: "ركن القراءة <br/> المميز بالدار",
    subtitle: "أحدث الروايات والكتب العلمية بأفضل الأسعار حصرياً",
    image: "https://images.unsplash.com/photo-1524578271613-d550eebad474?w=800&q=80",
    bg: "bg-[#4338ca]", // Indigo
    text: "text-white",
    btnColor: "bg-white text-indigo-600"
  }
];

// No static fallbacks. The store only relies on real database data.

/* ═══════ MARKETPLACE HERO ═══════ */
const DarAlSafwaHero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${query}`);
  };

  return (
    <div className="relative w-full pb-20 -mt-20">
      {/* ═══ MINIMALIST HIGH-END HERO ═══ */}
      <div className="w-full h-[550px] md:h-[650px] relative">
        <div className="absolute inset-0 rounded-b-lg md:rounded-b-[20px] overflow-hidden shadow-lg bg-slate-900">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <motion.img 
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 12 }}
              src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1920&q=80" 
              alt="Dar Al Safwa" 
              className="w-full h-full object-cover brightness-50" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?w=1920&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-at-t from-slate-900/80 via-transparent to-slate-900/20"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-6 pt-20">
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl">
                {t("app.name") as string}
              </h1>
              <p className="text-xl md:text-3xl font-medium text-white/90 max-w-3xl mx-auto drop-shadow-md leading-relaxed">
                {t("hero.description") as string}
              </p>
            </motion.div>
          </div>
        </div>

        {/* ═══ FLOATING SEARCH BAR ═══ */}
        <div className="absolute -bottom-8 left-0 right-0 z-30 px-6">
          <form 
            onSubmit={handleSearch}
            className="max-w-4xl mx-auto"
          >
            <div className="flex flex-row-reverse items-center bg-white rounded-2xl md:rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.15)] border-[4px] border-white overflow-hidden transition-all duration-300">
              {/* Search Button */}
              <button 
                type="submit"
                className="bg-slate-900 hover:bg-violet-600 text-white p-5 md:p-6 transition-all"
              >
                <Search className="w-7 h-7 md:w-9 md:h-9" />
              </button>

              {/* Input Field */}
              <input 
                type="text"
                placeholder={t("nav.searchPlaceholder") as string}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent px-8 py-5 md:py-6 text-xl md:text-2xl font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none text-right"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ═══════ HORIZONTAL SCROLL ═══════ */
const HScroll = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * 320, behavior: "smooth" });

  return (
    <div className="relative group/hscroll">
      <button
        onClick={() => scroll(-1)}
        className="absolute -start-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-2xl flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border border-gray-100 dark:border-gray-700 opacity-0 group-hover/hscroll:opacity-100 -translate-x-2 group-hover/hscroll:translate-x-0"
      >
        <ChevronLeft className="w-5 h-5 text-gray-800 dark:text-gray-200" />
      </button>
      <button
        onClick={() => scroll(1)}
        className="absolute -end-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-2xl flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border border-gray-100 dark:border-gray-700 opacity-0 group-hover/hscroll:opacity-100 translate-x-2 group-hover/hscroll:translate-x-0"
      >
        <ChevronRight className="w-5 h-5 text-gray-800 dark:text-gray-200" />
      </button>
      <div ref={ref} className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-6 px-4 -mx-4">
        {children}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN HOME PAGE
   ═══════════════════════════════════════════ */
const HomePage = () => {
  const { t, language } = useLanguage();

  const { products: allProducts, loading: productsLoading } = useProducts();
  const { categories: fetchedCategories, loading: categoriesLoading } = useCategories();

  const deals = useMemo(() => {
    return allProducts.filter(p => {
      if (p.isFlashSale) return true;
      return p.originalPrice && p.originalPrice > p.price;
    }).slice(0, 10);
  }, [allProducts]);

  const bestSellers = useMemo(() => allProducts.filter(p => p.badge === "Best Seller" || p.rating >= 4.8).slice(0, 8), [allProducts]);
  const categories = useMemo(() => fetchedCategories.filter(c => c?.id), [fetchedCategories]);

  const catEmoji: Record<string, string> = {
    books: "📚", educational: "🎓", electronics: "💻", toys: "🎮",
    gifts: "🎁", art: "🎨", office: "✏️", digital: "📱",
  };

  const [showAll, setShowAll] = useState(false);
  const visibleProducts = showAll ? allProducts : allProducts.slice(0, 12);

  return (
    <main className="bg-[#fcfdfe] min-h-screen pb-20 lg:pb-0">

      {/* ═══ DAR AL SAFWA HERO (Immersive Splash) ═══ */}
      <section className="w-full relative -mt-20">
        <DarAlSafwaHero />
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="section-padding py-10 overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
            hidden: {}
          }}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-1"
        >
          {categories.map((c, i) => (
            <motion.div
              key={c.id}
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
              }}
            >
              <Link
                to={`/category/${c.slug || c.id}`}
                className="flex items-center gap-3 min-w-[160px] px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_24px_rgba(67,56,202,0.08)] hover:-translate-y-1 transition-all duration-500 group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-gray-50 group-hover:bg-indigo-50 transition-colors duration-500">
                  {catEmoji[c.id] || "📦"}
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 whitespace-nowrap transition-colors block">
                    {resolveCategoryName(c, language)}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400">{t("category.browseNow") as string}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══ FLASH DEALS ═══ */}
      {deals.length > 0 && (
        <section className="section-padding py-12 relative overflow-hidden">
          {/* Section Background Subtle Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[80%] bg-indigo-500/5 blur-[120px] pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
               <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full animate-pulse"></div>
               </div>
               <div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1">
                    {t("home.flash.title") as string}
                  </h2>
                  <p className="text-sm font-medium text-gray-400">{t("home.flash.subtitle") as string}</p>
               </div>
            </div>
            <Link to="/search?q=flash" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-2 group transition-all">
              <span className="border-b-2 border-transparent group-hover:border-indigo-600 pb-0.5">{t("category.viewAll") as string}</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
          </div>

          <HScroll>
            {deals.map((p, i) => (
              <div key={p.id} className="min-w-[240px] max-w-[280px] shrink-0">
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </HScroll>
        </section>
      )}

      {/* ═══ BEST SELLERS ═══ */}
      <section className="section-padding mt-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg md:text-xl font-extrabold text-gray-900">{t("home.bestselling.title") as string}</h2>
          </div>
          <Link to="/category/books" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
            {t("category.viewAll") as string} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {bestSellers.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ═══ ALL PRODUCTS ═══ */}
      <section className="section-padding mt-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg md:text-xl font-extrabold text-gray-900">{t("home.cta.shopSale") as string}</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {visibleProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {!showAll && allProducts.length > 12 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(true)}
              className="px-8 py-3 rounded-full border-2 border-gray-200 text-gray-700 text-sm font-bold hover:border-indigo-600 hover:text-indigo-600 transition-colors"
            >
              {t("category.viewAll") as string} ({allProducts.length - 12}+)
            </button>
          </div>
        )}
      </section>

      {/* ═══ SCROLL TO TOP ═══ */}
      <ScrollToTopBtn />
    </main>
  );
};

/* ═══════ SCROLL TO TOP ═══════ */
const ScrollToTopBtn = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-24 lg:bottom-8 end-6 w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-xl transition-all duration-300 z-40 hover:bg-indigo-600"
      style={{ opacity: show ? 1 : 0, transform: show ? "scale(1)" : "scale(0.6)", pointerEvents: show ? "auto" : "none" }}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

export default HomePage;
