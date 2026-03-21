import { Link } from "react-router-dom";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCartContext } from "@/contexts/CartContext";
import type { Product } from "@/data/products";

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { addToCart, wishlist, toggleWishlist } = useCartContext();
  const isWished = wishlist.includes(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-card rounded-xl overflow-hidden border border-border card-hover"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
            product.badge === "Deal" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
          }`}>
            {product.badge}
          </span>
        )}
        <button
          onClick={e => { e.preventDefault(); toggleWishlist(product.id); }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 btn-press ${
            isWished ? "bg-destructive/10 text-destructive" : "bg-card/80 text-muted-foreground hover:text-destructive"
          }`}
        >
          <Heart className="w-4 h-4" fill={isWished ? "currentColor" : "none"} />
        </button>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium line-clamp-2 leading-snug mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "text-accent fill-accent" : "text-muted"}`} />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image })}
            className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors btn-press"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
