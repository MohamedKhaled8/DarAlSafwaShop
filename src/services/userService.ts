import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp
} from "firebase/firestore";
import { db } from "./firebase";

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: "customer" | "admin";
  status: "Active" | "Inactive" | "New" | "VIP";
  ordersCount: number;
  totalSpent: number;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

const USERS_COLLECTION = "users";

// ==================== USERS ====================

export const getAllUsers = async (limitCount: number = 100): Promise<User[]> => {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as User));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where("email", "==", email),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as User;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error("Failed to fetch user");
  }
};

// Admin: Update user
export const updateUser = async (userId: string, updates: Partial<User>): Promise<void> => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
};

// Admin: Update user status
export const updateUserStatus = async (userId: string, status: User["status"]): Promise<void> => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error("Error updating user status:", error);
    throw new Error("Failed to update user status");
  }
};

// Admin: Delete user
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
};

// Get user statistics
export const getUserStats = async (): Promise<{
  total: number;
  active: number;
  inactive: number;
  new: number;
  vip: number;
}> => {
  try {
    const snapshot = await getDocs(collection(db, USERS_COLLECTION));
    const users = snapshot.docs.map(doc => doc.data() as User);
    
    return {
      total: users.length,
      active: users.filter(u => u.status === "Active").length,
      inactive: users.filter(u => u.status === "Inactive").length,
      new: users.filter(u => u.status === "New").length,
      vip: users.filter(u => u.status === "VIP").length,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      total: 0,
      active: 0,
      inactive: 0,
      new: 0,
      vip: 0,
    };
  }
};
