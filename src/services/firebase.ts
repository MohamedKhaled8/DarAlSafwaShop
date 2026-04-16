import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCPgWl2GPpMfCCsHhDdJ6YpgxxDgvzi73w",
  authDomain: "alkema-31f95.firebaseapp.com",
  projectId: "alkema-31f95",
  storageBucket: "alkema-31f95.firebasestorage.app",
  messagingSenderId: "329074550673",
  appId: "1:329074550673:web:bd7eec254663e73c981c30",
  measurementId: "G-LSYSQYWJQ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;
