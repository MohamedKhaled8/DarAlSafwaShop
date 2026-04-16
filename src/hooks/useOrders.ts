import { useState, useEffect, useCallback } from "react";
import {
  getAllOrders,
  getOrderById,
  getOrdersByStatus,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
  type Order,
  type OrderStatus,
} from "@/services/orderService";

// ==================== ORDERS HOOK ====================

export const useOrders = (limit: number = 100) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllOrders(limit);
      setOrders(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
};

export const useOrder = (orderId: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(orderId);
        setOrder(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return { order, loading, error };
};

export const useOrdersByStatus = (status: OrderStatus) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrdersByStatus(status);
        setOrders(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [status]);

  return { orders, loading, error };
};

// ==================== ORDER MANAGEMENT HOOK ====================

export const useOrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllOrders(1000);
      setOrders(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const addOrder = async (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
    try {
      setActionLoading(true);
      const id = await createOrder(order);
      await fetchOrders();
      return id;
    } catch (err: any) {
      setError(err.message || "Failed to create order");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const editOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      setActionLoading(true);
      await updateOrder(orderId, updates);
      await fetchOrders();
    } catch (err: any) {
      setError(err.message || "Failed to update order");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const changeOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      setActionLoading(true);
      await updateOrderStatus(orderId, status);
      await fetchOrders();
    } catch (err: any) {
      setError(err.message || "Failed to update order status");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const removeOrder = async (orderId: string) => {
    try {
      setActionLoading(true);
      await deleteOrder(orderId);
      await fetchOrders();
    } catch (err: any) {
      setError(err.message || "Failed to delete order");
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

// ==================== ORDER STATS HOOK ====================

export const useOrderStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    totalRevenue: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getOrderStats();
        setStats(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch order stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error, refetch: () => getOrderStats().then(setStats) };
};
