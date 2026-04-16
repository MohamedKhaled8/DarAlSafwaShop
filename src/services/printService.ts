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

export interface PrintOrder {
  id: string;
  customerId: string;
  customerName: string;
  email: string;
  fileName: string;
  fileUrl: string;
  size: "A4" | "A3" | "A2" | "A1" | "Letter" | "Legal";
  copies: number;
  color: "Color" | "B&W" | "Grayscale";
  paperType: "Standard" | "Glossy" | "Matte" | "Cardstock";
  doubleSided: boolean;
  status: "Pending" | "Printing" | "Ready" | "Completed" | "Cancelled";
  total: number;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type PrintOrderStatus = PrintOrder["status"];

const PRINT_ORDERS_COLLECTION = "printOrders";

// ==================== PRINT ORDERS ====================

export const getAllPrintOrders = async (limitCount: number = 100): Promise<PrintOrder[]> => {
  try {
    const q = query(
      collection(db, PRINT_ORDERS_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as PrintOrder));
  } catch (error) {
    console.error("Error fetching print orders:", error);
    throw new Error("Failed to fetch print orders");
  }
};

export const getPrintOrderById = async (orderId: string): Promise<PrintOrder | null> => {
  try {
    const docRef = doc(db, PRINT_ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as PrintOrder;
    }
    return null;
  } catch (error) {
    console.error("Error fetching print order:", error);
    throw new Error("Failed to fetch print order");
  }
};

export const getPrintOrdersByStatus = async (status: PrintOrderStatus): Promise<PrintOrder[]> => {
  try {
    const q = query(
      collection(db, PRINT_ORDERS_COLLECTION),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as PrintOrder));
  } catch (error) {
    console.error("Error fetching print orders by status:", error);
    throw new Error("Failed to fetch print orders");
  }
};

// Admin: Create print order
export const createPrintOrder = async (order: Omit<PrintOrder, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, PRINT_ORDERS_COLLECTION), {
      ...order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating print order:", error);
    throw new Error("Failed to create print order");
  }
};

// Admin: Update print order
export const updatePrintOrder = async (orderId: string, updates: Partial<PrintOrder>): Promise<void> => {
  try {
    const docRef = doc(db, PRINT_ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating print order:", error);
    throw new Error("Failed to update print order");
  }
};

// Admin: Update print order status
export const updatePrintOrderStatus = async (orderId: string, status: PrintOrderStatus): Promise<void> => {
  try {
    const docRef = doc(db, PRINT_ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating print order status:", error);
    throw new Error("Failed to update print order status");
  }
};

// Admin: Delete print order
export const deletePrintOrder = async (orderId: string): Promise<void> => {
  try {
    const docRef = doc(db, PRINT_ORDERS_COLLECTION, orderId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting print order:", error);
    throw new Error("Failed to delete print order");
  }
};

// Get print order statistics
export const getPrintOrderStats = async (): Promise<{
  total: number;
  pending: number;
  printing: number;
  ready: number;
  completed: number;
  cancelled: number;
  todayRevenue: number;
}> => {
  try {
    const snapshot = await getDocs(collection(db, PRINT_ORDERS_COLLECTION));
    const orders = snapshot.docs.map(doc => doc.data() as PrintOrder);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === "Pending").length,
      printing: orders.filter(o => o.status === "Printing").length,
      ready: orders.filter(o => o.status === "Ready").length,
      completed: orders.filter(o => o.status === "Completed").length,
      cancelled: orders.filter(o => o.status === "Cancelled").length,
      todayRevenue: orders
        .filter(o => {
          const orderDate = o.createdAt?.toDate ? o.createdAt.toDate() : o.createdAt ? new Date(o.createdAt as any) : new Date(0);
          return orderDate >= today && o.status !== "Cancelled";
        })
        .reduce((sum, o) => sum + o.total, 0),
    };
  } catch (error) {
    console.error("Error fetching print order stats:", error);
    return {
      total: 0,
      pending: 0,
      printing: 0,
      ready: 0,
      completed: 0,
      cancelled: 0,
      todayRevenue: 0,
    };
  }
};
