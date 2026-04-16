import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  UserCredential,
  User,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface UserData {
  uid: string;
  name: string;
  phone: string;
  avatar?: string;
  governorate?: string;
  address?: string;
  role?: string;
}

export const registerUser = async (
  email: string, 
  password: string, 
  data: Omit<UserData, "uid">
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save extra data to Firestore with retry logic
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          ...data,
          uid: user.uid,
          email: user.email,
          createdAt: new Date().toISOString(),
        });
        break; // Success, exit retry loop
      } catch (firestoreError: any) {
        retryCount++;
        if (retryCount >= maxRetries) {
          // If all retries failed, still return the user but log the error
          console.warn("Failed to save user profile after retries:", firestoreError);
          // Don't throw - user is created, profile can be saved later
          break;
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
      }
    }

    return userCredential;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email is already registered. Please login.');
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address.');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak. Use at least 6 characters.');
    }
    if (error.code === 'permission-denied' || error.message?.includes('Missing permission')) {
      throw new Error('Permission denied. Please contact support.');
    }
    throw new Error(error.message || "Failed to register user");
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password.');
    }
    if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password.');
    }
    throw new Error(error.message || "Failed to login");
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || "Failed to logout");
  }
};

export const getUserProfile = async (uid: string) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserData;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message || "Failed to get user profile");
  }
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
