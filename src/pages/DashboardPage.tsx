import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { User, Package, Heart, Settings } from "lucide-react";
import { useCartContext } from "@/contexts/CartContext";
import { products } from "@/data/products";

const fakeOrders = [
  { id: "ORD-7842", date: "Mar 15, 2026", status: "Delivered", total: 89.97, items: 3 },
  { id: "ORD-6291", date: "Mar 8, 2026", status: "Shipped", total: 45.99, items: 1 },
  { id: "ORD-5103", date: "Feb 22, 2026", status: "Delivered", total: 134.97, items: 4 },
];

const DashboardPage = () => {
  const { wishlist } = useCartContext();
  const wishedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <main className="pb-20 lg:pb-0">
      <div className="section-padding py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-bold mb-6">My Account</h1>
        </motion.div>

        <div className="lg:flex gap-8">
          {/* Sidebar */}
          <motion.aside initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="lg:w-64 mb-6 lg:mb-0">
            <div className="bg-card rounded-xl border border-border p-6 text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <User className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold">Alex Morgan</h3>
              <p className="text-xs text-muted-foreground">alex.morgan@email.com</p>
            </div>
            <nav className="space-y-1">
              {[
                { icon: Package, label: "Orders", active: true },
                { icon: Heart, label: "Wishlist" },
                { icon: Settings, label: "Settings" },
              ].map(({ icon: Icon, label, active }) => (
                <button key={label} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </nav>
          </motion.aside>

          <div className="flex-1 space-y-8">
            {/* Orders */}
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
              <div className="space-y-3">
                {fakeOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
                    <div>
                      <p className="text-sm font-medium">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.date} · {order.items} items</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold tabular-nums">${order.total.toFixed(2)}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${order.status === "Delivered" ? "bg-primary/10 text-primary" : "bg-accent/20 text-accent-foreground"}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Wishlist */}
            <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-lg font-bold mb-4">Wishlist ({wishedProducts.length})</h2>
              {wishedProducts.length === 0 ? (
                <div className="text-center py-10 bg-card rounded-xl border border-border">
                  <Heart className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">Your wishlist is empty</p>
                  <Link to="/" className="text-sm text-primary font-medium hover:underline">Explore products</Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {wishedProducts.map(p => (
                    <Link key={p.id} to={`/product/${p.id}`} className="flex gap-3 p-3 bg-card rounded-xl border border-border card-hover">
                      <img src={p.image} alt={p.name} className="w-14 h-14 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                        <p className="text-sm font-bold mt-1">${p.price.toFixed(2)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
