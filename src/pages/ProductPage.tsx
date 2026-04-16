import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, ChevronRight, Minus, Plus, Loader2 } from "lucide-react";
import { useCartContext } from "@/contexts/CartContext";
import { useProduct, useProductsByCategory } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";

const fakeReviews = [
  { name: "Emily R.", date: "2 weeks ago", rating: 5, text: "Excellent quality! Exactly what I was looking for. Fast shipping too." },
  { name: "Omar K.", date: "1 month ago", rating: 4, text: "Good value for money. Minor packaging issue but product is great." },
  { name: "Lina T.", date: "2 months ago", rating: 5, text: "My students love it. Highly recommend for anyone in education." },
];

const ProductPage = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { product, loading } = useProduct(id || "");
  const { products: relatedProducts, loading: relatedLoading } = useProductsByCategory(product?.category || "");
  const { addToCart, wishlist, toggleWishlist } = useCartContext();
  const [activeTab, setActiveTab] = useState<string>("Description");
  const [qty, setQty] = useState(1);
  const [imageIdx, setImageIdx] = useState(0);

  const tabs = [
    t("product.description") as string || "Description",
    t("product.reviews") as string || "Reviews", 
    t("product.specifications") as string || "Specifications"
  ];

  // Scroll to top when product ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!product) return (
    <div className="section-padding py-20 text-center">
      <p className="text-lg font-medium">{(t("product.notFound") as string) || "Product not found"}</p>
      <Link to="/" className="text-sm text-primary mt-2 inline-block hover:underline">{(t("nav.home") as string)}</Link>
    </div>
  );

  const isWished = wishlist.includes(product.id);
  const related = relatedProducts.filter(p => p.id !== product.id).slice(0, 4);
  // Use real images array from product, fallback to single image
  const images = (product.images && product.images.length > 0) ? product.images : [product.image];
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <main className="pb-20 lg:pb-0">
      <div className="section-padding py-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">{(t("nav.home") as string)}</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/category/${product.category}`} className="hover:text-foreground transition-colors capitalize">{product.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground truncate max-w-[150px]">{product.name}</span>
        </nav>

        <div className="lg:flex gap-10">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 mb-8 lg:mb-0"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary mb-3">
              <img src={images[imageIdx]} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 cursor-zoom-in" />
            </div>
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImageIdx(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === imageIdx ? "border-primary" : "border-transparent"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:w-1/2"
          >
            {product.badge && (
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                product.badge === "Deal" ? "bg-accent/20 text-accent-foreground" : "bg-primary/10 text-primary"
              }`}>
                {product.badge === "Deal" ? (t("product.off") as string) : product.badge}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-3">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-accent fill-accent" : "text-muted"}`} />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews} {(t("product.reviews") as string) || "reviews"})</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold">{product.price.toFixed(2)} {(t("currency") as string)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{product.originalPrice.toFixed(2)} {(t("currency") as string)}</span>
                  <span className="text-sm font-semibold text-primary">-{discount}%</span>
                </>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border border-border rounded-full">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-2.5 hover:bg-secondary rounded-l-full transition-colors btn-press">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-medium tabular-nums">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="p-2.5 hover:bg-secondary rounded-r-full transition-colors btn-press">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <button
                onClick={() => { for (let i = 0; i < qty; i++) addToCart({ id: product.id, name: product.name, price: product.price, image: product.image }); }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors btn-press"
              >
                <ShoppingCart className="w-4 h-4" /> {(t("product.addToCart") as string)}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-full border transition-all btn-press ${isWished ? "bg-destructive/10 border-destructive/30 text-destructive" : "border-border hover:bg-secondary"}`}
              >
                <Heart className="w-5 h-5" fill={isWished ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>✓ {(t("product.inStock") as string) || "In Stock"}</span>
              <span>✓ {(t("trust.fastDelivery") as string)}</span>
              <span>✓ {(t("trust.easyReturns") as string)}</span>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12"
        >
          <div className="flex gap-1 border-b border-border mb-6">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="min-h-[200px]">
            {activeTab === "Description" && (
              <p className="text-sm leading-relaxed text-muted-foreground max-w-2xl">{product.description} This premium product has been carefully selected for quality and value. Ideal for students, professionals, and hobbyists alike. Each item undergoes strict quality control before shipping.</p>
            )}
            {activeTab === "Reviews" && (
              <div className="space-y-4 max-w-2xl">
                {fakeReviews.map((r, i) => (
                  <div key={i} className="p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{r.name[0]}</div>
                        <span className="text-sm font-medium">{r.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="w-3 h-3 text-accent fill-accent" />)}
                    </div>
                    <p className="text-sm text-muted-foreground">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "Specifications" && (
              <div className="max-w-md">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-3 border-b border-border last:border-0">
                    <span className="text-sm font-medium">{k}</span>
                    <span className="text-sm text-muted-foreground">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Related */}
        {related.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-14"
          >
            <h2 className="text-xl font-bold mb-6">{(t("product.related") as string) || "Related Products"}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
};

export default ProductPage;
