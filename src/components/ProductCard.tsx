import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useCartContext } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Product } from "@/data/products";
import { resolveProductBadge, resolveProductName } from "@/lib/localizedContent";
import { cn } from "@/lib/utils";

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { addToCart, wishlist, toggleWishlist } = useCartContext();
  const { t, language } = useLanguage();
  const displayName = resolveProductName(product, language);
  const badgeLabel = resolveProductBadge(product.badge, language, t);
  const inWishlist = wishlist.includes(product.id);
  const productUrl = `/product/${product.id}`;

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
    >
      {/* Full-card link layer (clicks go to product except interactive controls) */}
      <Link
        to={productUrl}
        className="absolute inset-0 z-10 rounded-2xl"
        aria-label={displayName}
      />

      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
        <div className="pointer-events-none absolute top-2 end-2 z-20 flex flex-col gap-1.5">
          {discount ? (
            <span className="rounded-lg bg-rose-500 px-2 py-1 text-[10px] font-black text-white shadow-md shadow-rose-100">
              {discount}%-
            </span>
          ) : null}
          {product.badge && !discount && badgeLabel ? (
            <span className="rounded-lg bg-violet-600 px-2 py-1 text-[10px] font-black uppercase text-white shadow-md shadow-violet-100">
              {badgeLabel}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          aria-pressed={inWishlist}
          aria-label={inWishlist ? (t("nav.wishlist") as string) : (t("nav.wishlist") as string)}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={cn(
            "absolute start-2 top-2 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/95 text-rose-500 shadow-md backdrop-blur-sm transition-colors hover:bg-white",
            inWishlist && "bg-rose-500 text-white hover:bg-rose-600",
          )}
        >
          <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
        </button>

        <div className="pointer-events-none relative z-0 h-full w-full">
          <motion.img
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.45 }}
            src={product.image}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Text block: links for a11y; visually same as card click */}
      <div className="pointer-events-none relative z-20 flex flex-1 flex-col bg-white p-3.5">
        <span className="pointer-events-none mb-1 text-[10px] font-bold uppercase tracking-wider text-violet-600 opacity-70">
          {(t("app.name") as string)}
        </span>

        <Link to={productUrl} className="relative z-20 mb-2 block pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          <h3 className="line-clamp-2 h-[2.8em] text-[13px] font-bold leading-snug text-slate-800 transition-colors group-hover:text-violet-600">
            {displayName}
          </h3>
        </Link>

        <div className="pointer-events-none mb-3 flex items-center gap-1">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-slate-400">({product.reviews})</span>
        </div>

        <div className="relative z-20 mt-auto flex items-center justify-between">
          <div className="pointer-events-none flex flex-col">
            {discount ? (
              <span className="-mb-1 text-[11px] font-medium text-slate-300 line-through">
                {product.originalPrice?.toFixed(2)}
              </span>
            ) : null}
            <span className="text-base font-black tracking-tight text-slate-900">
              {product.price.toFixed(2)}{" "}
              <span className="text-[10px] font-bold text-violet-600">{(t("currency") as string)}</span>
            </span>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart({ id: product.id, name: displayName, price: product.price, image: product.image });
            }}
            className="relative z-30 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm transition-colors hover:bg-violet-600"
            aria-label={t("nav.cart") as string}
          >
            <ShoppingCart className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
