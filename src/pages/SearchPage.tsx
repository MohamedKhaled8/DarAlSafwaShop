import { useMemo, useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearchProducts } from "@/hooks/useProducts";

const SearchPage = () => {
  const [params] = useSearchParams();
  const raw = params.get("q") ?? "";
  const query = raw.trim();
  const { t } = useLanguage();
  const [debounced, setDebounced] = useState(query);

  useEffect(() => {
    const h = window.setTimeout(() => setDebounced(query), 300);
    return () => window.clearTimeout(h);
  }, [query]);

  const searchTerm = debounced.length >= 2 ? debounced : "";
  const { products, loading, error } = useSearchProducts(searchTerm);

  const title = useMemo(() => {
    if (!query) return t("search.title") as string;
    return `${t("search.title") as string} ${t("search.for") as string} «${query}»`;
  }, [query, t]);

  return (
    <main className="min-h-[60vh] pb-20 lg:pb-0">
      <div className="section-padding py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 text-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <Search className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
              {query.length >= 2 && !loading && (
                <p className="text-sm text-muted-foreground mt-1">
                  {products.length} {(t("category.products") as string)}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {(query.length === 0 || query.length < 2) && (
          <p className="text-muted-foreground text-center py-16">{t("search.hint") as string}</p>
        )}

        {query.length >= 2 && loading && (
          <div className="flex justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
          </div>
        )}

        {query.length >= 2 && !loading && error && (
          <p className="text-center text-destructive py-12">{error}</p>
        )}

        {query.length >= 2 && !loading && !error && products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg font-medium text-slate-700 mb-2">{t("noResults") as string}</p>
            <Link to="/" className="text-sm text-emerald-600 font-medium hover:underline">
              {t("nav.home") as string}
            </Link>
          </div>
        )}

        {query.length >= 2 && !loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}

      </div>
    </main>
  );
};

export default SearchPage;
