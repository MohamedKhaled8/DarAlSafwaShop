import { motion } from "framer-motion";
import { Store, Bell, Shield, Palette, Database, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

const SettingsPage = () => {
  const { t } = useLanguage();
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">{t("admin.settings") as string}</h1>
        <p className="text-sm text-muted-foreground">{t("adminSettings.subtitle") as string}</p>
      </div>

      {/* Store */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Store className="w-5 h-5 text-primary" /></div>
            <div>
              <CardTitle className="text-base">{t("adminSettings.storeInfo") as string}</CardTitle>
              <CardDescription>{t("adminSettings.storeDetails") as string}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("adminSettings.storeName") as string}</label>
              <Input defaultValue="مكتبة دار الصفوة" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("adminSettings.storeEmail") as string}</label>
              <Input defaultValue="admin@daralsafwa.com" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">{t("adminSettings.storeDescription") as string}</label>
            <textarea className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={t("hero.title") as string} />
          </div>
          <Button className="rounded-xl">{t("dashboard.saveChanges") as string}</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Bell className="w-5 h-5 text-blue-600" /></div>
            <div>
              <CardTitle className="text-base">{t("adminSettings.notifications") as string}</CardTitle>
              <CardDescription>{t("adminSettings.notificationPrefs") as string}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: t("adminSettings.newOrderAlerts") as string, desc: t("adminSettings.newOrderDesc") as string, on: true },
            { label: t("adminSettings.lowStockWarnings") as string, desc: t("adminSettings.lowStockDesc") as string, on: true },
            { label: t("adminSettings.customerMessages") as string, desc: t("adminSettings.customerDesc") as string, on: false },
          ].map(n => (
            <div key={n.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{n.label}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <Switch defaultChecked={n.on} />
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SettingsPage;
