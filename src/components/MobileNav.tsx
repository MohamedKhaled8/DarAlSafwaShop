import { Link, useLocation } from "react-router-dom";
import { Home, Grid3X3, ShoppingCart, User } from "lucide-react";
import { useCartContext } from "@/contexts/CartContext";

const MobileNav = () => {
  const { pathname } = useLocation();
  const { cartCount } = useCartContext();
  const links = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/category/books", icon: Grid3X3, label: "Categories" },
    { to: "/cart", icon: ShoppingCart, label: "Cart", badge: cartCount },
    { to: "/dashboard", icon: User, label: "Account" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border lg:hidden">
      <div className="flex items-center justify-around h-14">
        {links.map(l => {
          const active = pathname === l.to;
          return (
            <Link key={l.to} to={l.to} className="flex flex-col items-center gap-0.5 relative">
              <l.icon className={`w-5 h-5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`} />
              {l.badge ? (
                <span className="absolute -top-1 right-0 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                  {l.badge}
                </span>
              ) : null}
              <span className={`text-[10px] ${active ? "text-primary font-medium" : "text-muted-foreground"}`}>{l.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
