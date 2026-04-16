import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrderStats } from "@/hooks/useOrders";
import { useUserStats } from "@/hooks/useUsers";
import { Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

const visitorData = [
  { name: "Mon", visitors: 1200, pageViews: 3400 }, { name: "Tue", visitors: 1900, pageViews: 4200 },
  { name: "Wed", visitors: 1600, pageViews: 3800 }, { name: "Thu", visitors: 2100, pageViews: 5100 },
  { name: "Fri", visitors: 2400, pageViews: 5800 }, { name: "Sat", visitors: 1800, pageViews: 4500 },
  { name: "Sun", visitors: 1400, pageViews: 3200 },
];

const deviceData = [
  { name: "Mobile", value: 58 }, { name: "Desktop", value: 32 }, { name: "Tablet", value: 10 },
];

const conversionData = [
  { name: "Jan", rate: 2.1 }, { name: "Feb", rate: 2.4 }, { name: "Mar", rate: 2.8 },
  { name: "Apr", rate: 3.1 }, { name: "May", rate: 2.9 }, { name: "Jun", rate: 3.5 },
];

const COLORS = ["hsl(122, 39%, 49%)", "hsl(45, 100%, 51%)", "hsl(220, 70%, 55%)"];

const AnalyticsPage = () => {
  const { t } = useLanguage();
  const { stats: orderStats, loading: ordersLoading } = useOrderStats();
  const { stats: userStats, loading: usersLoading } = useUserStats();
  
  const isLoading = ordersLoading || usersLoading;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("adminAnalytics.title") as string}</h1>
        <p className="text-sm text-muted-foreground">{t("adminAnalytics.subtitle") as string}</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{t("admin.orders") as string}</p>
                <p className="text-2xl font-bold">{orderStats.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{t("adminOverview.totalRevenue") as string}</p>
                <p className="text-2xl font-bold">{orderStats.totalRevenue.toFixed(0)} {t("currency") as string}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{t("admin.customers") as string}</p>
                <p className="text-2xl font-bold">{userStats.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{t("adminOverview.delivered") as string}</p>
                <p className="text-2xl font-bold">{orderStats.delivered}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2"><CardTitle className="text-base">{t("adminAnalytics.salesChart") as string}</CardTitle></CardHeader>
              <CardContent className="pt-0 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={visitorData}>
                    <defs>
                      <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(122, 39%, 49%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(122, 39%, 49%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="pvGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(45, 100%, 51%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(45, 100%, 51%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(0, 0%, 45%)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(0, 0%, 45%)" />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(0, 0%, 90%)", fontSize: 13 }} />
                    <Area type="monotone" dataKey="visitors" stroke="hsl(122, 39%, 49%)" fill="url(#visGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="pageViews" stroke="hsl(45, 100%, 51%)" fill="url(#pvGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">{t("adminAnalytics.revenueByCategory") as string}</CardTitle></CardHeader>
              <CardContent className="pt-0 h-[300px] flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={deviceData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                      {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-2">
                  {deviceData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-1.5 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                      {d.name} ({d.value}%)
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">{t("adminAnalytics.topProducts") as string}</CardTitle></CardHeader>
            <CardContent className="pt-0 h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(0, 0%, 45%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(0, 0%, 45%)" tickFormatter={v => `${v}%`} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} formatter={(v: any) => `${v}%`} />
                  <Line type="monotone" dataKey="rate" stroke="hsl(122, 39%, 49%)" strokeWidth={2} dot={{ fill: "hsl(122, 39%, 49%)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </motion.div>
  );
};

export default AnalyticsPage;
