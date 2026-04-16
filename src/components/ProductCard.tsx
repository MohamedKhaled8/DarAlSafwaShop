import { Link } from "react-router-dom";
import { Star, ShoppingCart, Eye, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useCartContext } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Product } from "@/data/products";
import { resolveProductBadge, resolveProductName } from "@/lib/localizedContent";

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { addToCart } = useCartContext();
  const { t, language } = useLanguage();
  const displayName = resolveProductName(product, language);
  const badgeLabel = resolveProductBadge(product.badge, language, t);

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
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-500 h-full"
    >
      {/* ═══ IMAGE SECTION ═══ */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
        {/* Badges */}
        <div className="absolute top-2 end-2 z-20 flex flex-col gap-1.5">
          {discount && (
            <span className="px-2 py-1 rounded-lg bg-rose-500 text-white text-[10px] font-black shadow-md shadow-rose-100">
              {discount}%-
            </span>
          )}
          {product.badge && !discount && badgeLabel && (
            <span className="px-2 py-1 rounded-lg bg-violet-600 text-white text-[10px] font-black shadow-md shadow-violet-100 uppercase">
              {badgeLabel}
            </span>
          )}
        </div>

        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 z-10 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 backdrop-blur-[1px]">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="w-9 h-9 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-lg cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="w-9 h-9 rounded-full bg-white text-rose-500 flex items-center justify-center shadow-lg cursor-pointer"
          >
            <Heart className="w-4 h-4" />
          </motion.div>
        </div>

        <Link to={`/product/${product.id}`} className="block w-full h-full overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5 }}
            src={product.image}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>

      {/* ═══ CONTENT SECTION ═══ */}
      <div className="p-3.5 flex flex-col flex-1 bg-white">
        <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider mb-1 opacity-70">
          {(t("app.name") as string)}
        </span>

        <Link to={`/product/${product.id}`} className="mb-2 block group/title">
          <h3 className="text-[13px] font-bold text-slate-800 line-clamp-2 leading-snug group-hover/title:text-violet-600 transition-colors h-[2.8em]">
            {displayName}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating) 
                    ? "text-amber-400 fill-amber-400" 
                    : "text-slate-200 fill-slate-200"
                }`} 
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-slate-400">({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            {discount && (
              <span className="text-[11px] font-medium text-slate-300 line-through -mb-1">
                {product.originalPrice?.toFixed(2)}
              </span>
            )}
            <span className="text-base font-black text-slate-900 tracking-tight">
              {product.price.toFixed(2)} <span className="text-[10px] font-bold text-violet-600">{(t("currency") as string)}</span>
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart({ id: product.id, name: displayName, price: product.price, image: product.image })}
            className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-violet-600 shadow-sm transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

