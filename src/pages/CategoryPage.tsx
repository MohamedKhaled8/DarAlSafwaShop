import { Link, useParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useProductsByCategory, useCategories, getCategoryDisplayName } from "@/hooks/useProducts";
import { useLanguage } from "@/contexts/LanguageContext";

const CategoryPage = () => {
  const { t, language } = useLanguage();
  const { id } = useParams();
  const { products: catProducts, loading: productsLoading } = useProductsByCategory(id || "");
  const { categories, loading: categoriesLoading } = useCategories();
  const category = categories.find(c => c.id === id || c.slug === id);
  /** Upper bound includes all products in this category (fixes EGP etc. vs hardcoded $300) */
  const priceMax = useMemo(() => {
    if (catProducts.length === 0) return 10_000;
    const hi = Math.max(...catProducts.map(p => p.price));
    return Math.max(100, Math.ceil(hi * 1.05));
  }, [catProducts]);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10_000]);
  const [minRating, setMinRating] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setMinRating(0);
    setPriceRange([0, priceMax]);
  }, [id, priceMax]);

  const filtered = catProducts.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1] && p.rating >= minRating);

  return (
    <main className="pb-20 lg:pb-0">
      <div className="section-padding py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            {category ? getCategoryDisplayName(category, language) : (t("category.allProducts") as string)}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">{filtered.length} {(t("category.products") as string)}</p>
        </motion.div>

        <div className="lg:flex gap-8">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary text-sm font-medium mb-4 btn-press"
          >
            <SlidersHorizontal className="w-4 h-4" /> {t("nav.categories") as string}
          </button>

          {/* Sidebar */}
          <aside className={`
            fixed inset-0 z-50 bg-card p-6 lg:relative lg:inset-auto lg:bg-transparent lg:p-0 lg:w-56 lg:shrink-0
            ${filtersOpen ? "block" : "hidden lg:block"}
          `}>
            <div className="flex items-center justify-between lg:hidden mb-6">
              <h3 className="font-semibold">{t("nav.categories") as string}</h3>
              <button onClick={() => setFiltersOpen(false)} className="p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-3">{t("category.priceRange") as string}</h4>
                <input
                  type="range"
                  min={0}
                  max={priceMax}
                  value={Math.min(priceRange[1], priceMax)}
                  onChange={e => setPriceRange([0, +e.target.value])}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span>{Math.round(priceRange[1])}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-3">{t("category.minRating") as string}</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 0].map(r => (
                    <button
                      key={r}
                      onClick={() => { setMinRating(r); setFiltersOpen(false); }}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${minRating === r ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
                    >
                      {r > 0 ? `${r}+ ★` : (t("category.allRatings") as string)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-3">{t("footer.quickLinks") as string}</h4>
                <div className="space-y-1">
                  {categories.filter(c => c?.id).map(c => {
                    const pathId = c.slug || c.id;
                    const active = c.id === id || c.slug === id;
                    return (
                      <Link
                        key={c.id}
                        to={`/category/${pathId}`}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
                      >
                        {getCategoryDisplayName(c, language)}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {productsLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : catProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg font-medium mb-2">{t("category.emptyInCategory") as string}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {(t("category.categoryIdLabel") as string)}: {id}
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg font-medium mb-2">{t("category.noMatchesFilters") as string}</p>
                <p className="text-sm text-muted-foreground">{t("category.adjustFilters") as string}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;
