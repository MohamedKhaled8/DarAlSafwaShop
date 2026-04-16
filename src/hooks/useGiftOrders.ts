import { useState, useEffect, useCallback } from "react";
import {
  getAllGiftOrders,
  getGiftOrderById,
  getGiftOrdersByStatus,
  createGiftOrder,
  updateGiftOrder,
  updateGiftOrderStatus,
  deleteGiftOrder,
  getGiftOrderStats,
  type GiftOrder,
  type GiftOrderStatus,
} from "@/services/giftService";

// ==================== GIFT ORDERS HOOK ====================

export const useGiftOrders = (limit: number = 100) => {
  const [orders, setOrders] = useState<GiftOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllGiftOrders(limit);
      setOrders(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch gift orders");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
};

export const useGiftOrder = (orderId: string) => {
  const [order, setOrder] = useState<GiftOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getGiftOrderById(orderId);
        setOrder(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch gift order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return { order, loading, error };
};

// ==================== GIFT ORDER MANAGEMENT HOOK ====================

export const useGiftOrderManagement = () => {
  const [orders, setOrders] = useState<GiftOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllGiftOrders(1000);
      setOrders(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch gift orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const addOrder = async (order: Omit<GiftOrder, "id" | "createdAt" | "updatedAt">) => {
    try {
      setActionLoading(true);
      const id = await createGiftOrder(order);
      await fetchOrders();
      return id;
    } catch (err: any) {
      setError(err.message || "Failed to create gift order");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const editOrder = async (orderId: string, updates: Partial<GiftOrder>) => {
    try {
      setActionLoading(true);
      await updateGiftOrder(orderId, updates);
      await fetchOrders();
    } catch (err: any) {
      setError(err.message || "Failed to update gift order");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const changeOrderStatus = async (orderId: string, status: GiftOrderStatus) => {
    try {
      setActionLoading(true);
      await updateGiftOrderStatus(orderId, status);
      await fetchOrders();
    } catch (err: any) {
      setError(err.message || "Failed to update gift order status");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const removeOrder = async (orderId: string) => {
    try {
      setActionLoading(true);
      await deleteGiftOrder(orderId);
      await fetchOrders();
    } catch (err: any) {
      setError(err.message || "Failed to delete gift order");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    actionLoading,
    addOrder,
    editOrder,
    changeOrderStatus,
    removeOrder,
    refresh: fetchOrders,
  };
};

// ==================== GIFT ORDER STATS HOOK ====================

export const useGiftOrderStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProduction: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    thisMonthRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getGiftOrderStats();
        setStats(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch gift order stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error, refetch: () => getGiftOrderStats().then(setStats) };
};
