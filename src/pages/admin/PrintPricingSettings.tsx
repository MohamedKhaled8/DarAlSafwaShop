import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrintPricing } from "@/hooks/usePrintPricing";
import type { PrintPriceTier, PrintPricingConfig } from "@/services/printPricingService";
import { toast } from "sonner";

const emptyTier = (): PrintPriceTier => ({
  id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  labelAr: "",
  labelEn: "",
  price: 0,
});

const PrintPricingSettings = () => {
  const { t } = useLanguage();
  const { config, loading, save, refetch } = usePrintPricing();
  const [draft, setDraft] = useState<PrintPricingConfig | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config) setDraft(config);
  }, [config]);

  if (loading && !draft) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!draft) return null;

  const updateSizes = (next: PrintPriceTier[]) => setDraft({ ...draft, paperSizes: next });
  const updateTypes = (next: PrintPriceTier[]) => setDraft({ ...draft, paperTypes: next });

  const handleSave = async () => {
    const sizes = draft.paperSizes.filter((r) => r.labelAr.trim() || r.labelEn.trim());
    const types = draft.paperTypes.filter((r) => r.labelAr.trim() || r.labelEn.trim());
    if (!sizes.length || !types.length) {
      toast.error(t("adminPrinting.pricingNeedRows") as string);
      return;
    }
    try {
      setSaving(true);
      await save({ ...draft, paperSizes: sizes, paperTypes: types });
      toast.success(t("adminPrinting.pricingSaved") as string);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const TierTable = ({
    title,
    rows,
    onChange,
  }: {
    title: string;
    rows: PrintPriceTier[];
    onChange: (rows: PrintPriceTier[]) => void;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => onChange([...rows, emptyTier()])}>
          <Plus className="h-4 w-4" /> {t("adminPrinting.addRow") as string}
        </Button>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_5rem_2.5rem] gap-1 bg-muted/50 px-2 py-1.5 text-[10px] font-semibold uppercase text-muted-foreground">
          <span>AR</span>
          <span>EN</span>
          <span className="text-center">{t("adminPrinting.priceShort") as string}</span>
          <span />
        </div>
        <div className="divide-y divide-border max-h-[240px] overflow-y-auto">
          {rows.map((row, idx) => (
            <div key={row.id} className="grid grid-cols-[1fr_1fr_5rem_2.5rem] gap-1 p-2 items-center">
              <Input
                value={row.labelAr}
                onChange={(e) => onChange(rows.map((r, i) => (i === idx ? { ...r, labelAr: e.target.value } : r)))}
                className="h-8 text-xs"
                placeholder="عربي"
              />
              <Input
                value={row.labelEn}
                onChange={(e) => onChange(rows.map((r, i) => (i === idx ? { ...r, labelEn: e.target.value } : r)))}
                className="h-8 text-xs"
                placeholder="EN"
              />
              <Input
                type="number"
                min={0}
                step={0.5}
                value={row.price}
                onChange={(e) =>
                  onChange(rows.map((r, i) => (i === idx ? { ...r, price: Math.max(0, Number(e.target.value) || 0) } : r)))
                }
                className="h-8 text-xs text-center"
              />
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-destructive" onClick={() => onChange(rows.filter((_, i) => i !== idx))}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-primary/15">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t("adminPrinting.pricingTitle") as string}</CardTitle>
          <CardDescription>{t("adminPrinting.pricingDesc") as string}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <TierTable title={t("adminPrinting.pricingSizes") as string} rows={draft.paperSizes} onChange={updateSizes} />
            <TierTable title={t("adminPrinting.pricingTypes") as string} rows={draft.paperTypes} onChange={updateTypes} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("adminPrinting.colorExtra") as string}</label>
              <Input
                type="number"
                min={0}
                step={0.5}
                value={draft.colorExtraPerCopy}
                onChange={(e) => setDraft({ ...draft, colorExtraPerCopy: Math.max(0, Number(e.target.value) || 0) })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("adminPrinting.bwExtra") as string}</label>
              <Input
                type="number"
                min={0}
                step={0.5}
                value={draft.bwExtraPerCopy}
                onChange={(e) => setDraft({ ...draft, bwExtraPerCopy: Math.max(0, Number(e.target.value) || 0) })}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{t("adminPrinting.pricingFormula") as string}</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" className="gap-2 rounded-xl" disabled={saving} onClick={() => void handleSave()}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {t("adminPrinting.savePricing") as string}
            </Button>
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => void refetch()}>
              {t("common.retry") as string}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PrintPricingSettings;
