import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  writeBatch,
  Timestamp
} from "firebase/firestore";
import { db } from "./firebase";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variantId?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  altPhone?: string;
  nationalId: string;
  email: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentStatus: "Pending" | "Paid" | "Refunded" | "Failed";
  deliveryMethod: "shipping" | "pickup";
  governorate?: string | null;
  paymentMethod?: string;
  receiptImage?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type OrderStatus = Order["status"];
export type PaymentStatus = Order["paymentStatus"];

const ORDERS_COLLECTION = "orders";

// ==================== ORDERS ====================

export const getAllOrders = async (limitCount: number = 100): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Order));
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    }
    return null;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new Error("Failed to fetch order");
  }
};

export const getOrdersByCustomer = async (customerId: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where("customerId", "==", customerId)
    );
    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Order));

    // Sort in memory to avoid requiring a composite index in Firestore
    return orders.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt as any)?.seconds || 0;
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt as any)?.seconds || 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    throw new Error("Failed to fetch customer orders");
  }
};

export const getOrdersByStatus = async (status: OrderStatus): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Order));
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    throw new Error("Failed to fetch orders");
  }
};

// Admin: Create order
export const createOrder = async (order: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  try {
    // Firebase doesn't accept undefined values, so we scrub them
    const cleanOrder: any = { ...order };
    Object.keys(cleanOrder).forEach(key => cleanOrder[key] === undefined && delete cleanOrder[key]);
    
    if (cleanOrder.items) {
      cleanOrder.items = cleanOrder.items.map((item: any) => {
        const cleanItem = { ...item };
        Object.keys(cleanItem).forEach(key => cleanItem[key] === undefined && delete cleanItem[key]);
        return cleanItem;
      });
    }

    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...cleanOrder,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error: any) {
    console.error("Error creating order:", error);
    throw new Error(error.message || "Failed to create order");
  }
};

// Admin: Update order
export const updateOrder = async (orderId: string, updates: Partial<Order>): Promise<void> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating order:", error);
    throw new Error("Failed to update order");
  }
};

// Admin: Update order status
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
};

// Admin: Delete order
export const deleteOrder = async (orderId: string): Promise<void> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting order:", error);
    throw new Error("Failed to delete order");
  }
};

// Get order statistics
export const getOrderStats = async (): Promise<{
  total: number;
  totalRevenue: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}> => {
  try {
    const snapshot = await getDocs(collection(db, ORDERS_COLLECTION));
    const orders = snapshot.docs.map(doc => doc.data() as Order);
    
    return {
      total: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? o.total : 0), 0),
      pending: orders.filter(o => o.status === "Pending").length,
      processing: orders.filter(o => o.status === "Processing").length,
      shipped: orders.filter(o => o.status === "Shipped").length,
      delivered: orders.filter(o => o.status === "Delivered").length,
      cancelled: orders.filter(o => o.status === "Cancelled").length,
    };
  } catch (error) {
    console.error("Error fetching order stats:", error);
    return {
      total: 0,
      totalRevenue: 0,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
  }
};
