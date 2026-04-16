import { useState, useCallback, useEffect } from 'react';
import { shippingService, ShippingRate } from '@/services/shippingService';

export const useShippingRates = (initialLoad = true) => {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await shippingService.getAll();
      setRates(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch shipping rates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActiveRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await shippingService.getActive();
      setRates(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch active shipping rates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialLoad) {
      fetchRates();
    }
  }, [fetchRates, initialLoad]);

  return {
    rates,
    loading,
    error,
    refetch: fetchRates,
    fetchActiveRates
  };
};
