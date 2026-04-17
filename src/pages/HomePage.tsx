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
import ProductCard from "@/components/ProductCard";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { HERO_IMAGE_PATHS } from "@/data/heroImages";

/* ═══════ MARKETPLACE HERO ═══════ */
const HERO_CROSSFADE_MS = 2200;
const HERO_SLIDE_INTERVAL_MS = 5500;

const DarAlSafwaHero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  /** Bottom layer index — always fully opaque */
  const [baseIndex, setBaseIndex] = useState(0);
  /** Top layer fades in over bottom; avoids black “between” two semi-transparent layers */
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [cutTransition, setCutTransition] = useState(false);
  const commitTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    HERO_IMAGE_PATHS.forEach((src) => {
      const im = new Image();
      im.src = src;
    });
  }, []);

  useEffect(() => {
    const runCycle = () => {
      if (commitTimerRef.current) window.clearTimeout(commitTimerRef.current);
      setCutTransition(false);
      requestAnimationFrame(() => {
        setOverlayVisible(true);
      });
      commitTimerRef.current = window.setTimeout(() => {
        setCutTransition(true);
        setOverlayVisible(false);
        setBaseIndex((i) => (i + 1) % HERO_IMAGE_PATHS.length);
        requestAnimationFrame(() => setCutTransition(false));
      }, HERO_CROSSFADE_MS);
    };

    const id = window.setInterval(runCycle, HERO_SLIDE_INTERVAL_MS);
    return () => {
      window.clearInterval(id);
      if (commitTimerRef.current) window.clearTimeout(commitTimerRef.current);
    };
  }, []);

  const bottomSrc = HERO_IMAGE_PATHS[baseIndex];
  const topSrc = HERO_IMAGE_PATHS[(baseIndex + 1) % HERO_IMAGE_PATHS.length];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length >= 2) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="relative w-full pb-20 -mt-20">
      <div className="w-full h-[550px] md:h-[650px] relative">
        <div className="absolute inset-0 overflow-hidden bg-neutral-950 shadow-lg">
          <div className="absolute inset-0">
            <img
              src={bottomSrc}
              alt=""
              decoding="async"
              fetchPriority="high"
              className="absolute inset-0 z-0 block h-full w-full object-cover object-center brightness-[0.52]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <img
              src={topSrc}
              alt=""
              decoding="async"
              style={cutTransition ? undefined : { transitionDuration: "2200ms" }}
              className={`pointer-events-none absolute inset-0 z-[1] block h-full w-full object-cover object-center brightness-[0.52] ease-in-out ${
                cutTransition ? "transition-none" : "transition-opacity"
              } ${overlayVisible ? "opacity-100" : "opacity-0"}`}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/80 via-black/15 to-black/45" />
          </div>

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

        <div className="absolute -bottom-8 left-0 right-0 z-30 px-6">
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-row-reverse items-center overflow-hidden rounded-2xl bg-white shadow-[0_20px_40px_rgba(0,0,0,0.15)] ring-1 ring-black/5 transition-all duration-300">
              <button type="submit" className="shrink-0 bg-slate-900 p-5 text-white transition-all hover:bg-violet-600 md:p-6">
                <Search className="w-7 h-7 md:w-9 md:h-9" />
              </button>
              <input
                type="text"
                placeholder={t("nav.searchPlaceholder") as string}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full min-w-0 bg-transparent px-8 py-5 md:py-6 text-xl md:text-2xl font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none text-right"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

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

      {/* ═══ CATEGORIES (moved from navbar — first strip under hero) ═══ */}
      <section id="categories-strip" className="section-padding scroll-mt-24 pb-10 pt-4">
        <div className="mb-4 flex items-end justify-between gap-4 px-1">
          <h2 className="text-lg font-extrabold text-gray-900 md:text-xl">{t("home.categoriesStripTitle") as string}</h2>
        </div>
        {categoriesLoading ? (
          <div className="min-h-[76px]" aria-hidden />
        ) : categories.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-1">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/category/${c.slug || c.id}`}
                className="group flex min-w-[160px] shrink-0 items-center gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(67,56,202,0.08)]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-2xl transition-colors duration-300 group-hover:bg-indigo-50">
                  {catEmoji[c.id] || "📦"}
                </div>
                <div>
                  <span className="block whitespace-nowrap text-sm font-bold text-gray-800 transition-colors group-hover:text-indigo-600">
                    {resolveCategoryName(c, language)}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400">{t("category.browseNow") as string}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
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
