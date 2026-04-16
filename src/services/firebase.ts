import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCPgWl2GPpMfCCsHhDdJ6YpgxxDgvzi73w",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "alkema-31f95.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "alkema-31f95",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "alkema-31f95.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "329074550673",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:329074550673:web:bd7eec254663e73c981c30",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-LSYSQYWJQ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;
