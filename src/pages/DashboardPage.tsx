import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { User, Package, Heart, Settings, Shield, Loader2, MapPin, Phone, Mail, Edit } from "lucide-react";
import { useCartContext } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getOrdersByCustomer } from "@/services/orderService";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const DashboardPage = () => {
  const { t } = useLanguage();
  const { wishlist } = useCartContext();
  const { user, profile, isAdmin } = useAuth();
  const { products } = useProducts(100);
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || (user ? "orders" : "wishlist");
  const [activeTab, setActiveTab] = useState(initialTab);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  
  const wishedProducts = products.filter(p => wishlist.includes(p.id));

  // Sync tab with URL
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // If user state changes, update default tab if needed
  useEffect(() => {
    if (!user && activeTab === "orders") {
      setActiveTab("wishlist");
    }
  }, [user]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user?.uid) return;
      try {
        setOrdersLoading(true);
        const orders = await getOrdersByCustomer(user.uid);
        setUserOrders(orders);
      } catch (error) {
        console.error("Error fetching user orders:", error);
      } finally {
        setOrdersLoading(false);
      }
    };
    
    fetchUserOrders();
  }, [user?.uid]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return t("common.nA") as string || "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-500/10 text-green-600";
      case "Shipped": return "bg-blue-500/10 text-blue-600";
      case "Processing": return "bg-amber-500/10 text-amber-600";
      case "Pending": return "bg-gray-500/10 text-gray-600";
      case "Cancelled": return "bg-red-500/10 text-red-600";
      default: return "bg-primary/10 text-primary";
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
    setProfileDialogOpen(false);
  };

  // Removed strict !user block so guests can see the wishlist.
  // We will handle the guest state within the tabs themselves.

  return (
    <main className="pb-20 lg:pb-0 min-h-screen">
      <div className="section-padding py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-bold mb-6">{(t("nav.account") as string)}</h1>
        </motion.div>

        <div className="lg:flex gap-8">
          {/* Sidebar */}
          <motion.aside initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="lg:w-64 mb-6 lg:mb-0">
            <div className="bg-card rounded-xl border border-border p-6 text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-7 h-7 text-primary" />
                )}
              </div>
              <h3 className="font-semibold">{profile?.name || user?.email?.split('@')[0] || "User"}</h3>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 text-xs"
                onClick={() => setProfileDialogOpen(true)}
              >
                <Edit className="w-3 h-3 mr-1" /> {(t("dashboard.editProfile") as string) || "Edit Profile"}
              </Button>
            </div>
            
            <nav className="space-y-1">
              {[
                ...(user ? [{ icon: Package, label: (t("nav.orders") as string), id: "orders" }] : []),
                { icon: Heart, label: (t("nav.wishlist") as string), id: "wishlist" },
                ...(user ? [{ icon: Settings, label: (t("dashboard.settings") as string) || "Settings", id: "settings" }] : []),
              ].map(({ icon: Icon, label, id }) => (
                <button 
                  key={id} 
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${activeTab === id ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
              {user && isAdmin && (
                <Link 
                  to="/admin" 
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors text-primary hover:bg-secondary"
                >
                  <Shield className="w-4 h-4" /> {(t("nav.admin") as string)}
                </Link>
              )}
            </nav>
          </motion.aside>

          <div className="flex-1 space-y-8">
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="text-lg font-bold mb-4">{(t("nav.orders") as string)} ({userOrders.length})</h2>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : userOrders.length === 0 ? (
                  <div className="text-center py-10 bg-card rounded-xl border border-border">
                    <Package className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">{(t("dashboard.noOrders") as string) || "No orders yet"}</p>
                    <Link to="/" className="text-sm text-primary font-medium hover:underline">{(t("hero.shopNow") as string)}</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
                        <div>
                          <p className="text-sm font-medium">#{order.id.slice(-6).toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)} · {order.items?.length || 0} {t("common.items") as string}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold tabular-nums">{order.total?.toFixed(2) || "0.00"} {t("currency") as string}</p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.section>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-lg font-bold mb-4">{(t("nav.wishlist") as string)} ({wishedProducts.length})</h2>
                {wishedProducts.length === 0 ? (
                  <div className="text-center py-10 bg-card rounded-xl border border-border">
                    <Heart className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">{(t("dashboard.emptyWishlist") as string) || "Your wishlist is empty"}</p>
                    <Link to="/" className="text-sm text-primary font-medium hover:underline">{(t("hero.explore") as string)}</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {wishedProducts.map(p => (
                      <Link key={p.id} to={`/product/${p.id}`} className="flex gap-3 p-3 bg-card rounded-xl border border-border card-hover">
                        <img src={p.image} alt={p.name} className="w-14 h-14 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                          <p className="text-sm font-bold mt-1">{p.price.toFixed(2)} {t("currency") as string}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.section>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-lg font-bold mb-4">{(t("dashboard.accountSettings") as string) || "Account Settings"}</h2>
                <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" /> {(t("dashboard.personalInfo") as string) || "Personal Information"}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground">{(t("dashboard.name") as string) || "Name"}</label>
                        <p className="font-medium">{profile?.name || (t("dashboard.notSet") as string) || "Not set"}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">{(t("common.email") as string) || "Email"}</label>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">{(t("dashboard.phone") as string) || "Phone"}</label>
                        <p className="font-medium">{profile?.phone || (t("dashboard.notSet") as string) || "Not set"}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">{(t("dashboard.governorate") as string) || "Governorate"}</label>
                        <p className="font-medium">{profile?.governorate || (t("dashboard.notSet") as string) || "Not set"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {(t("dashboard.address") as string) || "Address"}
                    </h3>
                    <p className="text-sm text-muted-foreground">{profile?.address || (t("dashboard.noAddress") as string) || "No address saved"}</p>
                  </div>

                  <Button onClick={() => setProfileDialogOpen(true)} className="rounded-xl">
                    <Edit className="w-4 h-4 mr-2" /> {(t("dashboard.editProfile") as string) || "Edit Profile"}
                  </Button>
                </div>
              </motion.section>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{(t("dashboard.editProfile") as string) || "Edit Profile"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile} className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">{(t("dashboard.fullName") as string) || "Full Name"}</label>
              <Input defaultValue={profile?.name} placeholder={(t("dashboard.namePlaceholder") as string) || "Your name"} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{(t("dashboard.phoneNumber") as string) || "Phone Number"}</label>
              <Input defaultValue={profile?.phone} placeholder={(t("dashboard.phonePlaceholder") as string) || "Your phone"} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{(t("dashboard.governorate") as string) || "Governorate"}</label>
              <Input defaultValue={profile?.governorate} placeholder={(t("dashboard.governoratePlaceholder") as string) || "Your governorate"} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{(t("dashboard.address") as string) || "Address"}</label>
              <textarea 
                className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue={profile?.address}
                placeholder={(t("dashboard.addressPlaceholder") as string) || "Your full address"}
              />
            </div>
            <Button type="submit" className="w-full rounded-xl">{(t("dashboard.saveChanges") as string) || "Save Changes"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default DashboardPage;
