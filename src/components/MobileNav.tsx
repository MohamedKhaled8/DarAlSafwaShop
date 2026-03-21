import { Link, useLocation } from "react-router-dom";
import { Home, Grid3X3, ShoppingCart, User } from "lucide-react";
import { motion } from "framer-motion";
import { useCartContext } from "@/contexts/CartContext";

const MobileNav = () => {
  const { pathname } = useLocation();
  const { cartCount } = useCartContext();
  const links = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/category/books", icon: Grid3X3, label: "Browse" },
    { to: "/cart", icon: ShoppingCart, label: "Cart", badge: cartCount },
    { to: "/dashboard", icon: User, label: "Account" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="mx-3 mb-2 bg-card/80 backdrop-blur-xl rounded-2xl border border-border/40 shadow-[0_-4px_30px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around h-16">
          {links.map(l => {
            const active = pathname === l.to;
            return (
              <Link key={l.to} to={l.to} className="flex flex-col items-center gap-1 relative px-4 py-1">
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={`p-1.5 rounded-xl transition-colors duration-300 ${active ? "bg-primary/10" : ""}`}
                >
                  <l.icon className={`w-5 h-5 transition-colors duration-300 ${active ? "text-primary" : "text-muted-foreground"}`} />
                </motion.div>
                {l.badge ? (
                  <motion.span
                    key={l.badge}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-2 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center shadow-sm"
                  >
                    {l.badge}
                  </motion.span>
                ) : null}
                <span className={`text-[10px] font-medium transition-colors duration-300 ${active ? "text-primary" : "text-muted-foreground"}`}>{l.label}</span>
                {active && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -bottom-0.5 w-5 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileNav;
