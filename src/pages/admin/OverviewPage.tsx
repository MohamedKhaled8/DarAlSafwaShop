import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Users, Package, Loader2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrderStats } from "@/hooks/useOrders";
import { useUserStats } from "@/hooks/useUsers";
import { useProducts } from "@/hooks/useProducts";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

// Sample chart data - would be replaced with real data in production
const salesData = [
  { name: "Mon", sales: 1200 },
  { name: "Tue", sales: 1900 },
  { name: "Wed", sales: 1600 },
  { name: "Thu", sales: 2100 },
  { name: "Fri", sales: 2400 },
  { name: "Sat", sales: 1800 },
  { name: "Sun", sales: 1400 },
];

const OverviewPage = () => {
  const { t } = useLanguage();
  const { stats: orderStats = { totalRevenue: 0, pending: 0, processing: 0, shipped: 0, delivered: 0 }, loading: ordersLoading } = useOrderStats();
  const { stats: userStats = { total: 0, new: 0 }, loading: usersLoading } = useUserStats();
  const { products = [], loading: productsLoading } = useProducts(1000);

  const isLoading = ordersLoading || usersLoading || productsLoading;

  const stats = [
    {
      title: t("adminOverview.totalRevenue") as string,
      value: `${orderStats.totalRevenue.toFixed(2)} ${t("currency")}`,
      change: "+20%",
      trend: "up",
      icon: TrendingUp,
      loading: ordersLoading,
    },
    {
      title: t("adminOverview.activeOrders") as string,
      value: orderStats.pending + orderStats.processing,
      subtitle: `${orderStats.pending} ${t("adminOverview.awaitProcessing")}`,
      icon: ShoppingBag,
      loading: ordersLoading,
    },
    {
      title: t("adminOverview.totalCustomers") as string,
      value: userStats.total,
      change: "+12%",
      trend: "up",
      icon: Users,
      loading: usersLoading,
    },
    {
      title: t("adminOverview.activeProducts") as string,
      value: products.length,
      subtitle: t("adminOverview.productsInStore") as string,
      icon: Package,
      loading: productsLoading,
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("adminOverview.title") as string}</h1>
          <p className="text-muted-foreground mt-1">{t("adminOverview.welcome") as string}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      {stat.loading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mt-1" />
                      ) : (
                        <p className="text-2xl font-bold break-words">{stat.value}</p>
                      )}
                    </div>
                  </div>
                  {stat.change && !stat.loading && (
                    <div className={`flex shrink-0 items-center gap-1 text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.change}
                    </div>
                  )}
                </div>
                {stat.subtitle && !stat.loading && (
                  <p className="text-xs text-muted-foreground mt-3">{stat.subtitle}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("adminOverview.salesOverview") as string}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: 12, 
                    border: "1px solid hsl(var(--border))", 
                    fontSize: 13,
                    backgroundColor: "hsl(var(--card))",
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="hsl(var(--primary))" 
                  fill="url(#salesGrad)" 
                  strokeWidth={2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("adminOverview.quickStats") as string}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("adminOverview.processing") as string}</p>
                    <p className="text-xs text-muted-foreground">{t("adminOverview.ordersInProgress") as string}</p>
                  </div>
                </div>
                {ordersLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <p className="text-lg font-semibold">{orderStats.processing}</p>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("adminOverview.delivered") as string}</p>
                    <p className="text-xs text-muted-foreground">{t("adminOverview.completedOrders") as string}</p>
                  </div>
                </div>
                {ordersLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <p className="text-lg font-semibold">{orderStats.delivered}</p>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("adminOverview.newCustomers") as string}</p>
                    <p className="text-xs text-muted-foreground">{t("adminOverview.thisMonth") as string}</p>
                  </div>
                </div>
                {usersLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <p className="text-lg font-semibold">{userStats.new}</p>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Package className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("adminOverview.shipped") as string}</p>
                    <p className="text-xs text-muted-foreground">{t("adminOverview.onTheWay") as string}</p>
                  </div>
                </div>
                {ordersLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <p className="text-lg font-semibold">{orderStats.shipped}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default OverviewPage;
