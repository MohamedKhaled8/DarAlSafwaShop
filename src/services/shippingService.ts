import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';

export interface ShippingRate {
  id: string;
  name: string; // Governorate name
  rate: number; // Shipping fee
  isActive: boolean;
}

const COLLECTION_NAME = 'shippingRates';

export const shippingService = {
  // Get all shipping rates
  getAll: async (): Promise<ShippingRate[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ShippingRate));
    } catch (error) {
      console.error('Error fetching shipping rates:', error);
      throw error;
    }
  },

  // Get active shipping rates only (for clients)
  getActive: async (): Promise<ShippingRate[]> => {
    try {
      const rates = await shippingService.getAll();
      return rates.filter(rate => rate.isActive);
    } catch (error) {
      console.error('Error fetching active shipping rates:', error);
      throw error;
    }
  },

  // Add a new shipping rate
  add: async (rate: Omit<ShippingRate, 'id'>): Promise<ShippingRate> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), rate);
      return {
        id: docRef.id,
        ...rate
      };
    } catch (error) {
      console.error('Error adding shipping rate:', error);
      throw error;
    }
  },

  // Update an existing shipping rate
  update: async (id: string, rateData: Partial<Omit<ShippingRate, 'id'>>): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, rateData);
    } catch (error) {
      console.error('Error updating shipping rate:', error);
      throw error;
    }
  },

  // Delete a shipping rate
  delete: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting shipping rate:', error);
      throw error;
    }
  }
};
