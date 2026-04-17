import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Loader2, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useShippingRates } from "@/hooks/useShippingRates";
import { shippingService } from "@/services/shippingService";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const EGYPT_GOVERNORATES = [
  "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة", "الفيوم",
  "الغربية", "الإسماعيلية", "المنوفية", "المنيا", "القليوبية", "الوادي الجديد", "السويس",
  "أسوان", "أسيوط", "بني سويف", "بورسعيد", "دمياط", "الشرقية", "جنوب سيناء",
  "كفر الشيخ", "مطروح", "الأقصر", "قنا", "شمال سيناء", "سوهاج"
];

const ShippingManagement = () => {
  const { t } = useLanguage();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", rate: 0, isActive: true });
  const [actionLoading, setActionLoading] = useState(false);
  
  const { rates, loading, error, refetch } = useShippingRates();

  const shippingErrText = (err: unknown) => {
    const m = err instanceof Error ? err.message : String(err);
    return m === "SHIPPING_FIRESTORE_PERMISSION" ? (t("adminShipping.rulesHint") as string) : m;
  };

  const handleOpenAdd = () => {
    setEditingRate(null);
    setFormData({ name: "", rate: 0, isActive: true });
    setDialogOpen(true);
  };

  const handleOpenEdit = (rate: any) => {
    setEditingRate(rate);
    setFormData({
      name: rate.name,
      rate: rate.rate,
      isActive: rate.isActive,
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingRate(null);
    setFormData({ name: "", rate: 0, isActive: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error((t("error.nameRequired") as string) || "Name required");
      return;
    }

    try {
      setActionLoading(true);
      if (editingRate) {
        await shippingService.update(editingRate.id, {
          name: formData.name,
          rate: Number(formData.rate),
          isActive: formData.isActive,
        });
        toast.success(t("adminShipping.rateUpdated") as string);
      } else {
        await shippingService.add({
          name: formData.name,
          rate: Number(formData.rate),
          isActive: formData.isActive,
        });
        toast.success(t("adminShipping.rateAdded") as string);
      }
      await refetch();
      handleClose();
    } catch (error: unknown) {
      toast.error(shippingErrText(error) || (t("adminShipping.saveFailed") as string));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("common.confirmDelete") as string || "Are you sure?")) return;
    try {
      await shippingService.delete(id);
      await refetch();
      toast.success(t("adminShipping.rateDeleted") as string);
    } catch (error: unknown) {
      toast.error(shippingErrText(error) || (t("adminShipping.deleteFailed") as string));
    }
  };

  const toggleStatus = async (rate: any) => {
    try {
      await shippingService.update(rate.id, { isActive: !rate.isActive });
      await refetch();
      toast.success(t("adminCustomers.statusUpdated") as string);
    } catch (error: unknown) {
      toast.error(shippingErrText(error) || (t("adminShipping.statusFailed") as string));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("adminShipping.title") as string}</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? t("loading") as string : `${rates.length} ${t("adminShipping.governorates") as string}`}
          </p>
        </div>
        <Button className="gap-2 rounded-xl" onClick={handleOpenAdd}>
          <Plus className="w-4 h-4" /> {t("adminShipping.addGovernorate") as string}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="rounded-xl">
          <AlertDescription className="space-y-3 text-sm leading-relaxed">
            <p>{error === "SHIPPING_FIRESTORE_PERMISSION" ? (t("adminShipping.rulesHint") as string) : error}</p>
            <Button variant="outline" size="sm" type="button" onClick={() => void refetch()}>
              {t("common.retry") as string}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div>
          {!loading && !error && rates.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>{t("adminShipping.noRates") as string}</p>
            </div>
          )}

          {!loading && rates.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {rates.map((rate, i) => (
                <motion.div 
                  key={rate.id} 
                  initial={{ opacity: 0, y: 16 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="overflow-hidden group hover:shadow-md transition-shadow relative">
                    <CardContent className="p-4 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${rate.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{rate.name}</h3>
                            <p className="text-sm font-bold text-primary">{rate.rate} EGP</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={`text-xs h-7 px-2 rounded-full ${rate.isActive ? 'border-primary/50 text-primary' : 'text-muted-foreground'}`}
                          onClick={() => toggleStatus(rate)}
                        >
                          {rate.isActive ? (t("adminShipping.active") as string) : (t("adminShipping.inactive") as string)}
                        </Button>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-7 h-7" 
                            onClick={() => handleOpenEdit(rate)}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-7 h-7 text-destructive" 
                            onClick={() => handleDelete(rate.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRate ? (t("adminShipping.editGovernorate") as string) : (t("adminShipping.addGovernorate") as string)}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("adminShipping.governorateName") as string} *</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              >
                <option value="" disabled>{t("adminShipping.selectGovernorate") as string}</option>
                {EGYPT_GOVERNORATES.map(gov => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("adminShipping.shippingRate") as string} *</label>
              <Input 
                type="number"
                min="0"
                step="1"
                placeholder="0" 
                value={formData.rate}
                onChange={e => setFormData({ ...formData, rate: Number(e.target.value) })}
                required
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input 
                type="checkbox" 
                id="isActive"
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-primary border-muted focus:ring-primary"
              />
              <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                {t("adminShipping.available") as string}
              </label>
            </div>
            <Button 
              className="rounded-xl mt-4" 
              type="submit"
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("adminShipping.saving") as string}
                </>
              ) : (
                 t("adminShipping.saveGovernorate") as string
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ShippingManagement;
