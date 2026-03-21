import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { categories, products } from "@/data/products";

const CategoryPage = () => {
  const { id } = useParams();
  const category = categories.find(c => c.id === id);
  const catProducts = id ? products.filter(p => p.category === id) : products;
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [minRating, setMinRating] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = catProducts.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1] && p.rating >= minRating);

  return (
    <main className="pb-20 lg:pb-0">
      <div className="section-padding py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">{category?.name || "All Products"}</h1>
          <p className="text-sm text-muted-foreground mb-6">{filtered.length} products found</p>
        </motion.div>

        <div className="lg:flex gap-8">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary text-sm font-medium mb-4 btn-press"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          {/* Sidebar */}
          <aside className={`
            fixed inset-0 z-50 bg-card p-6 lg:relative lg:inset-auto lg:bg-transparent lg:p-0 lg:w-56 lg:shrink-0
            ${filtersOpen ? "block" : "hidden lg:block"}
          `}>
            <div className="flex items-center justify-between lg:hidden mb-6">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-3">Price Range</h4>
                <input
                  type="range"
                  min={0}
                  max={300}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([0, +e.target.value])}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>$0</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-3">Minimum Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 0].map(r => (
                    <button
                      key={r}
                      onClick={() => { setMinRating(r); setFiltersOpen(false); }}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${minRating === r ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
                    >
                      {r > 0 ? `${r}+ Stars` : "All Ratings"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-3">Categories</h4>
                <div className="space-y-1">
                  {categories.map(c => (
                    <a
                      key={c.id}
                      href={`/category/${c.id}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${c.id === id ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
                    >
                      {c.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg font-medium mb-2">No products found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
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
