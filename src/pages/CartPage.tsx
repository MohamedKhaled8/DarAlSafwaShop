import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartContext } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import CheckoutAuthDialog from "@/components/CheckoutAuthDialog";

const CartPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCartContext();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleCheckoutClick = () => {
    if (user) {
      navigate('/checkout');
    } else {
      setShowAuthDialog(true);
    }
  };

  if (items.length === 0) {
    return (
      <main className="pb-20 lg:pb-0">
        <div className="section-padding py-20 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h1 className="text-2xl font-bold mb-2">{t("nav.cart") as string}</h1>
            <p className="text-sm text-muted-foreground mb-6">{(t("cart.empty") as string) || "Your cart is empty"}</p>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm btn-press">
              {(t("hero.shopNow") as string) || "Start Shopping"} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="pb-20 lg:pb-0">
      <div className="section-padding py-8">
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-3xl font-bold mb-6">
          {t("nav.cart") as string} ({items.length})
        </motion.h1>

        <div className="lg:flex gap-8">
          <div className="flex-1 space-y-3">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex gap-4 p-4 bg-card rounded-xl border border-border"
              >
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
                  <p className="text-lg font-bold mt-1">{(item.price * item.quantity).toFixed(2)} {(t("currency") as string)}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-border rounded-full">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-secondary rounded-l-full transition-colors btn-press">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-sm tabular-nums">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-secondary rounded-r-full transition-colors btn-press">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors btn-press">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-80 mt-6 lg:mt-0"
          >
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <h3 className="font-semibold mb-4">{(t("cart.summary") as string) || "Order Summary"}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{(t("cart.subtotal") as string) || "Subtotal"}</span>
                  <span className="tabular-nums">{cartTotal.toFixed(2)} {(t("currency") as string)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{(t("cart.shipping") as string) || "Shipping"}</span>
                  <span className="text-primary font-medium">{(t("trust.fastDelivery") as string)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                  <span>{(t("cart.total") as string) || "Total"}</span>
                  <span className="tabular-nums">{cartTotal.toFixed(2)} {(t("currency") as string)}</span>
                </div>
              </div>
              <button onClick={handleCheckoutClick} className="w-full mt-6 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors btn-press">
                {(t("cart.checkout") as string) || "Proceed to Checkout"}
              </button>
              <button onClick={clearCart} className="w-full mt-2 px-6 py-2.5 rounded-full text-sm text-muted-foreground hover:bg-secondary transition-colors btn-press">
                {(t("cart.clear") as string) || "Clear Cart"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <CheckoutAuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        redirectTo="/checkout"
      />
    </main>
  );
};

export default CartPage;
