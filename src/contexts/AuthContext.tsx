import { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { UserData, subscribeToAuthChanges, getUserProfile, logoutUser } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  profile: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  logout: async () => {},
  isAdmin: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      if (!firebaseUser) {
        if (mounted) {
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      // If there is a user, set loading to true while fetching profile
      if (mounted) setLoading(true);
      
      try {
        const userProfile = await getUserProfile(firebaseUser.uid);
        const isAdminUser = firebaseUser.email === "admin@admin.com" || userProfile?.role === "admin";
        
        if (mounted) {
          setUser(firebaseUser);
          setProfile(userProfile);
          setIsAdmin(isAdminUser);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (mounted) {
          setUser(firebaseUser);
          setProfile(null);
          setIsAdmin(false);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    await logoutUser();
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
