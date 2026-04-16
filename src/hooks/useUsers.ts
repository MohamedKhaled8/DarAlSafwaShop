import { useState, useEffect, useCallback } from "react";
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
  getUserStats,
  type User,
} from "@/services/userService";

// ==================== USERS HOOK ====================

export const useUsers = (limit: number = 100) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllUsers(limit);
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
};

export const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getUserById(userId);
        setUser(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
};

// ==================== USER MANAGEMENT HOOK ====================

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllUsers(1000);
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const editUser = async (userId: string, updates: Partial<User>) => {
    try {
      setActionLoading(true);
      await updateUser(userId, updates);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to update user");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const changeUserStatus = async (userId: string, status: User["status"]) => {
    try {
      setActionLoading(true);
      await updateUserStatus(userId, status);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to update user status");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const removeUser = async (userId: string) => {
    try {
      setActionLoading(true);
      await deleteUser(userId);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    actionLoading,
    editUser,
    changeUserStatus,
    removeUser,
    refresh: fetchUsers,
  };
};

// ==================== USER STATS HOOK ====================

export const useUserStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    new: 0,
    vip: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getUserStats();
        setStats(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch user stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error, refetch: () => getUserStats().then(setStats) };
};
