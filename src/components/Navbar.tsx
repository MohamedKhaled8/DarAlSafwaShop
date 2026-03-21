import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, ShoppingCart, User, Menu, X, Heart,
  BookOpen, GraduationCap, Laptop, Gamepad2, Gift,
  Palette, PenTool, Download, Printer, Sparkles,
} from "lucide-react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { useCartContext } from "@/contexts/CartContext";
import { categories, products } from "@/data/products";

const iconMap: Record<string, React.ElementType> = {
  BookOpen, GraduationCap, Laptop, Gamepad2, Gift, Palette, PenTool, Download,
};

const extraPills = [
  { id: "printing", name: "Printing", icon: Printer, to: "/printing" },
  { id: "custom-gifts", name: "Custom Gifts", icon: Sparkles, to: "/gifts" },
];

const HighlightText = ({ text, query }: { text: string; query: string }) => {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-primary font-semibold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, wishlist } = useCartContext();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const prevCartCount = useRef(cartCount);
  const [cartBounce, setCartBounce] = useState(false);

  // Shrink on scroll
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  // Cart bounce animation
  useEffect(() => {
    if (cartCount > prevCartCount.current) {
      setCartBounce(true);
      const t = setTimeout(() => setCartBounce(false), 600);
      return () => clearTimeout(t);
    }
    prevCartCount.current = cartCount;
  }, [cartCount]);

  const suggestions = searchQuery.length > 1
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleSuggestionClick = useCallback((id: string) => {
    navigate(`/product/${id}`);
    setSearchFocused(false);
    setSearchQuery("");
  }, [navigate]);

  return (
    <>
      <motion.header
        className="sticky top-0 z-50 transition-colors duration-500"
        animate={{
          paddingTop: scrolled ? 0 : 8,
          paddingLeft: scrolled ? 0 : 0,
          paddingRight: scrolled ? 0 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={`transition-all duration-500 ${
            scrolled
              ? "bg-card/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] border-b border-border/50"
              : "bg-card/60 backdrop-blur-lg shadow-[0_8px_40px_rgba(0,0,0,0.04)] mx-3 sm:mx-5 lg:mx-8 mt-0 rounded-2xl border border-border/40"
          }`}
        >
          {/* Top Row */}
          <div className="section-padding">
            <div className={`flex items-center justify-between gap-3 transition-all duration-300 ${scrolled ? "h-14" : "h-16"}`}>
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
                <motion.div
                  whileHover={{ rotate: 6, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center shadow-md shadow-primary/20"
                >
                  <span className="text-primary-foreground font-extrabold text-sm tracking-tight">E</span>
                </motion.div>
                <span className="font-bold text-lg tracking-tight hidden sm:block">
                  Edu<span className="text-gradient-primary">Store</span>
                </span>
              </Link>

              {/* Search — Desktop */}
              <div ref={searchRef} className="flex-1 max-w-2xl relative hidden md:block">
                <motion.div
                  animate={{ scale: searchFocused ? 1.02 : 1 }}
                  transition={{ duration: 0.25 }}
                  className={`relative rounded-full transition-shadow duration-300 ${
                    searchFocused
                      ? "shadow-[0_0_0_3px_hsl(var(--primary)/0.15),0_4px_20px_rgba(0,0,0,0.06)]"
                      : "shadow-sm"
                  }`}
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search books, electronics, supplies..."
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setSearchFocused(true); }}
                    onFocus={() => setSearchFocused(true)}
                    className="w-full pl-11 pr-4 py-3 rounded-full bg-secondary/70 border border-border/50 text-sm focus:outline-none focus:bg-card transition-all duration-300 placeholder:text-muted-foreground/60"
                  />
                </motion.div>
                <AnimatePresence>
                  {searchFocused && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full mt-3 w-full bg-card/95 backdrop-blur-xl rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.1)] border border-border/60 overflow-hidden"
                    >
                      <p className="px-4 pt-3 pb-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Suggestions</p>
                      {suggestions.map((p, i) => (
                        <motion.button
                          key={p.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          onClick={() => handleSuggestionClick(p.id)}
                          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-primary/5 transition-colors text-left group"
                        >
                          <img src={p.image} alt={p.name} className="w-11 h-11 rounded-xl object-cover shadow-sm ring-1 ring-border/50" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                              <HighlightText text={p.name} query={searchQuery} />
                            </p>
                            <p className="text-xs text-muted-foreground">${p.price.toFixed(2)}</p>
                          </div>
                          <Search className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-1">
                {/* Wishlist */}
                <Link
                  to="/dashboard"
                  className="hidden sm:flex relative p-2.5 rounded-xl hover:bg-primary/5 transition-all duration-200 btn-press group"
                >
                  <Heart className="w-[20px] h-[20px] text-foreground/70 group-hover:text-primary transition-colors" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
                  )}
                </Link>

                {/* Cart */}
                <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-primary/5 transition-all duration-200 btn-press group">
                  <motion.div
                    animate={cartBounce ? {
                      scale: [1, 1.3, 0.9, 1.1, 1],
                      rotate: [0, -8, 8, -4, 0],
                    } : {}}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <ShoppingCart className="w-[20px] h-[20px] text-foreground/70 group-hover:text-primary transition-colors" />
                  </motion.div>
                  <AnimatePresence mode="popLayout">
                    {cartCount > 0 && (
                      <motion.span
                        key={cartCount}
                        initial={{ scale: 0, y: 4 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-md shadow-primary/30"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>

                {/* User Avatar */}
                <div ref={userRef} className="relative hidden sm:block">
                  <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={() => setUserOpen(!userOpen)}
                    className={`p-1 rounded-xl transition-all duration-200 ${userOpen ? "bg-primary/10" : "hover:bg-primary/5"}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-sm">
                      <span className="text-primary-foreground text-xs font-bold">AM</span>
                    </div>
                  </motion.button>
                  <AnimatePresence>
                    {userOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 top-full mt-3 w-56 bg-card/95 backdrop-blur-xl rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.1)] border border-border/60 overflow-hidden"
                      >
                        <div className="px-4 py-4 border-b border-border/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
                              <span className="text-primary-foreground text-sm font-bold">AM</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold">Alex Morgan</p>
                              <p className="text-xs text-muted-foreground">alex@email.com</p>
                            </div>
                          </div>
                        </div>
                        {[
                          { label: "My Account", icon: User, to: "/dashboard" },
                          { label: "Orders", icon: ShoppingCart, to: "/dashboard" },
                          { label: "Wishlist", icon: Heart, to: "/dashboard" },
                        ].map((item, i) => (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 + i * 0.04 }}
                          >
                            <Link
                              to={item.to}
                              onClick={() => setUserOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-primary/5 transition-colors group"
                            >
                              <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              {item.label}
                            </Link>
                          </motion.div>
                        ))}
                        <div className="border-t border-border/50" />
                        <button className="w-full text-left px-4 py-3 text-sm text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-colors">
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Menu Toggle */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="lg:hidden p-2.5 rounded-xl hover:bg-primary/5 transition-colors"
                >
                  <AnimatePresence mode="wait">
                    {menuOpen ? (
                      <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <X className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <Menu className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Category Pills — Desktop */}
          <div className="hidden lg:block border-t border-border/30">
            <div className="section-padding">
              <div className="flex items-center gap-2 py-2.5 overflow-x-auto scrollbar-hide">
                {categories.map((cat) => {
                  const Icon = iconMap[cat.icon] || BookOpen;
                  return (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.id}`}
                      className="group flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/50 hover:bg-primary hover:border-primary text-sm font-medium whitespace-nowrap transition-all duration-300 hover:shadow-md hover:shadow-primary/10 btn-press"
                    >
                      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-300" />
                      <span className="text-foreground/80 group-hover:text-primary-foreground transition-colors duration-300">{cat.name}</span>
                    </Link>
                  );
                })}
                <div className="w-px h-5 bg-border/60 mx-1 shrink-0" />
                {extraPills.map((pill) => (
                  <Link
                    key={pill.id}
                    to={pill.to}
                    className="group flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 hover:bg-accent hover:border-accent text-sm font-medium whitespace-nowrap transition-all duration-300 hover:shadow-md hover:shadow-accent/10 btn-press"
                  >
                    <pill.icon className="w-4 h-4 text-accent group-hover:text-accent-foreground transition-colors duration-300" />
                    <span className="text-foreground/80 group-hover:text-accent-foreground transition-colors duration-300">{pill.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden px-4 pb-3">
            <div ref={searchRef} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSearchFocused(true); }}
                onFocus={() => setSearchFocused(true)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-secondary/70 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all"
              />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-foreground/20 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 left-0 bottom-0 z-[70] w-[280px] bg-card/95 backdrop-blur-xl shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="p-5">
                {/* Profile */}
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border/50">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-md">
                    <span className="text-primary-foreground font-bold text-sm">AM</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Alex Morgan</p>
                    <p className="text-xs text-muted-foreground">alex@email.com</p>
                  </div>
                </div>

                {/* Categories */}
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Categories</p>
                <div className="space-y-1 mb-6">
                  {categories.map((cat, i) => {
                    const Icon = iconMap[cat.icon] || BookOpen;
                    return (
                      <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.03 }}
                      >
                        <Link
                          to={`/category/${cat.id}`}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-primary/5 transition-colors group"
                        >
                          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="group-hover:text-primary transition-colors">{cat.name}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Services */}
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Services</p>
                <div className="space-y-1 mb-6">
                  {extraPills.map((pill, i) => (
                    <motion.div
                      key={pill.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.03 }}
                    >
                      <Link
                        to={pill.to}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-accent/10 transition-colors group"
                      >
                        <pill.icon className="w-4 h-4 text-accent" />
                        <span>{pill.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Account Links */}
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Account</p>
                <div className="space-y-1">
                  {[
                    { label: "My Account", icon: User, to: "/dashboard" },
                    { label: "Wishlist", icon: Heart, to: "/dashboard" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-primary/5 transition-colors group"
                    >
                      <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
