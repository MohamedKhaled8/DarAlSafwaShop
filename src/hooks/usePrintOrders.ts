import { useState, useEffect, useCallback } from "react";
import {
  getAllPrintOrders,
  getPrintOrderById,
  getPrintOrdersByStatus,
  createPrintOrder,
  updatePrintOrder,
  updatePrintOrderStatus,
  deletePrintOrder,
  getPrintOrderStats,
  type PrintOrder,
  type PrintOrderStatus,
} from "@/services/printService";

// ==================== PRINT ORDERS HOOK ====================

export const usePrintOrders = (limit: number = 100) => {
  const [orders, setOrders] = useState<PrintOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllPrintOrders(limit);
      setOrders(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch print orders");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
};

export const usePrintOrder = (orderId: string) => {
  const [order, setOrder] = useState<PrintOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getPrintOrderById(orderId);
        setOrder(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch print order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return { order, loading, error };
};

// ==================== PRINT ORDER MANAGEMENT HOOK ====================

export const usePrintOrderManagement = () => {
  const [orders, setOrders] = useState<PrintOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllPrintOrders(1000);
      setOrders(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch print orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const addOrder = async (order: Omit<PrintOrder, "id" | "createdAt" | "updatedAt">) => {
    try {
      setActionLoading(true);
      const id = await createPrintOrder(order);
      await fetchOrders();
      return id;
    } catch (err: any) {
      setError(err.message || "Failed to create print order");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const editOrder = async (orderId: string, updates: Partial<PrintOrder>) => {
    try {
      setActionLoading(true);
      await updatePrintOrder(orderId, updates);
      await fetchOrders();
    } catch (err: any) {
      setError(err.message || "Failed to update print order");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const changeOrderStatus = async (orderId: string, status: PrintOrderStatus) => {
    try {
      setActionLoading(true);
      await updatePrintOrderStatus(orderId, status);
      await fetchOrders();
    } catch (err: any) {
      setError(err.message || "Failed to update print order status");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const removeOrder = async (orderId: string) => {
    try {
      setActionLoading(true);
      await deletePrintOrder(orderId);
      await fetchOrders();
    } catch (err: any) {
      setError(err.message || "Failed to delete print order");
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

// ==================== PRINT ORDER STATS HOOK ====================

export const usePrintOrderStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    printing: 0,
    ready: 0,
    completed: 0,
    cancelled: 0,
    todayRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getPrintOrderStats();
        setStats(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch print order stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error, refetch: () => getPrintOrderStats().then(setStats) };
};
