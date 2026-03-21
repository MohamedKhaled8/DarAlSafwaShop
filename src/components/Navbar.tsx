import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartContext } from "@/contexts/CartContext";
import { categories, products } from "@/data/products";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const { cartCount } = useCartContext();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const suggestions = searchQuery.length > 1
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="section-padding">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:block">EduStore</span>
          </Link>

          {/* Search */}
          <div ref={searchRef} className="flex-1 max-w-xl relative hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products, categories..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-secondary border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
              />
            </div>
            <AnimatePresence>
              {searchOpen && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full mt-2 w-full bg-card rounded-xl shadow-xl border border-border overflow-hidden"
                >
                  {suggestions.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { navigate(`/product/${p.id}`); setSearchOpen(false); setSearchQuery(""); }}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary transition-colors text-left"
                    >
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-md object-cover" />
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                        <p className="text-xs text-muted-foreground">${p.price.toFixed(2)}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary transition-colors">
                Categories <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-1 bg-card rounded-xl shadow-xl border border-border p-4 grid grid-cols-2 gap-2 w-[380px]"
                  >
                    {categories.map(cat => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.id}`}
                        onClick={() => setMegaOpen(false)}
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded-md object-cover" />
                        <div>
                          <p className="text-sm font-medium">{cat.name}</p>
                          <p className="text-xs text-muted-foreground">{cat.count} items</p>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link to="/printing" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary transition-colors">Printing</Link>
            <Link to="/gifts" className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary transition-colors">Custom Gifts</Link>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-secondary transition-colors btn-press">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>
            <div className="relative hidden sm:block">
              <button onClick={() => setUserOpen(!userOpen)} className="p-2 rounded-full hover:bg-secondary transition-colors btn-press">
                <User className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 4 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-card rounded-xl shadow-xl border border-border overflow-hidden"
                  >
                    <Link to="/dashboard" onClick={() => setUserOpen(false)} className="block px-4 py-3 text-sm hover:bg-secondary transition-colors">My Account</Link>
                    <Link to="/dashboard" onClick={() => setUserOpen(false)} className="block px-4 py-3 text-sm hover:bg-secondary transition-colors">Orders</Link>
                    <Link to="/dashboard" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-secondary transition-colors">
                      <Heart className="w-4 h-4" /> Wishlist
                    </Link>
                    <div className="border-t border-border" />
                    <button className="w-full text-left px-4 py-3 text-sm hover:bg-secondary transition-colors text-muted-foreground">Sign Out</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-full hover:bg-secondary transition-colors">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-border overflow-hidden bg-card"
          >
            <div className="section-padding py-4 space-y-1">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm rounded-lg hover:bg-secondary transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
              <div className="border-t border-border my-2" />
              <Link to="/printing" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 text-sm rounded-lg hover:bg-secondary transition-colors">Printing Services</Link>
              <Link to="/gifts" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 text-sm rounded-lg hover:bg-secondary transition-colors">Custom Gifts</Link>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 text-sm rounded-lg hover:bg-secondary transition-colors">My Account</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
