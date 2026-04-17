import { useState, useEffect, useCallback } from "react";
import {
  getPrintPricingConfig,
  savePrintPricingConfig,
  type PrintPricingConfig,
} from "@/services/printPricingService";

export const usePrintPricing = () => {
  const [config, setConfig] = useState<PrintPricingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPrintPricingConfig();
      setConfig(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load print pricing";
      setError(msg);
      setConfig(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = useCallback(async (next: PrintPricingConfig) => {
    await savePrintPricingConfig(next);
    await load();
  }, [load]);

  return { config, loading, error, refetch: load, save };
};
