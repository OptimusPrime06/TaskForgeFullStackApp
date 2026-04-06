import { useState, useEffect, useCallback } from 'react';
import { usersApi, type User } from '../api/users.api';
import toast from 'react-hot-toast';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await usersApi.fetchAllUsers();
      setUsers(data.sort((a, b) => a.email.localeCompare(b.email)));
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to load users';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, isLoading, error, fetchUsers };
};
