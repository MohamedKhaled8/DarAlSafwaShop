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
  Timestamp
} from "firebase/firestore";
import { db } from "./firebase";

export interface GiftOrder {
  id: string;
  customerId: string;
  customerName: string;
  email: string;
  productType: "Mug" | "T-Shirt" | "Pillow" | "Frame" | "Keychain" | "Other";
  customText: string;
  customImageUrl?: string;
  color: string;
  size?: string;
  quantity: number;
  status: "Pending" | "In Production" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type GiftOrderStatus = GiftOrder["status"];

const GIFT_ORDERS_COLLECTION = "giftOrders";

// ==================== GIFT ORDERS ====================

export const getAllGiftOrders = async (limitCount: number = 100): Promise<GiftOrder[]> => {
  try {
    const q = query(
      collection(db, GIFT_ORDERS_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as GiftOrder));
  } catch (error) {
    console.error("Error fetching gift orders:", error);
    throw new Error("Failed to fetch gift orders");
  }
};

export const getGiftOrderById = async (orderId: string): Promise<GiftOrder | null> => {
  try {
    const docRef = doc(db, GIFT_ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as GiftOrder;
    }
    return null;
  } catch (error) {
    console.error("Error fetching gift order:", error);
    throw new Error("Failed to fetch gift order");
  }
};

export const getGiftOrdersByStatus = async (status: GiftOrderStatus): Promise<GiftOrder[]> => {
  try {
    const q = query(
      collection(db, GIFT_ORDERS_COLLECTION),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as GiftOrder));
  } catch (error) {
    console.error("Error fetching gift orders by status:", error);
    throw new Error("Failed to fetch gift orders");
  }
};

// Admin: Create gift order
export const createGiftOrder = async (order: Omit<GiftOrder, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, GIFT_ORDERS_COLLECTION), {
      ...order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating gift order:", error);
    throw new Error("Failed to create gift order");
  }
};

// Admin: Update gift order
export const updateGiftOrder = async (orderId: string, updates: Partial<GiftOrder>): Promise<void> => {
  try {
    const docRef = doc(db, GIFT_ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating gift order:", error);
    throw new Error("Failed to update gift order");
  }
};

// Admin: Update gift order status
export const updateGiftOrderStatus = async (orderId: string, status: GiftOrderStatus): Promise<void> => {
  try {
    const docRef = doc(db, GIFT_ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating gift order status:", error);
    throw new Error("Failed to update gift order status");
  }
};

// Admin: Delete gift order
export const deleteGiftOrder = async (orderId: string): Promise<void> => {
  try {
    const docRef = doc(db, GIFT_ORDERS_COLLECTION, orderId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting gift order:", error);
    throw new Error("Failed to delete gift order");
  }
};

// Get gift order statistics
export const getGiftOrderStats = async (): Promise<{
  total: number;
  pending: number;
  inProduction: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  thisMonthRevenue: number;
}> => {
  try {
    const snapshot = await getDocs(collection(db, GIFT_ORDERS_COLLECTION));
    const orders = snapshot.docs.map(doc => doc.data() as GiftOrder);
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === "Pending").length,
      inProduction: orders.filter(o => o.status === "In Production").length,
      shipped: orders.filter(o => o.status === "Shipped").length,
      delivered: orders.filter(o => o.status === "Delivered").length,
      cancelled: orders.filter(o => o.status === "Cancelled").length,
      thisMonthRevenue: orders
        .filter(o => {
          const orderDate = o.createdAt?.toDate ? o.createdAt.toDate() : o.createdAt ? new Date(o.createdAt as any) : new Date(0);
          return orderDate >= startOfMonth && o.status !== "Cancelled";
        })
        .reduce((sum, o) => sum + o.total, 0),
    };
  } catch (error) {
    console.error("Error fetching gift order stats:", error);
    return {
      total: 0,
      pending: 0,
      inProduction: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      thisMonthRevenue: 0,
    };
  }
};
