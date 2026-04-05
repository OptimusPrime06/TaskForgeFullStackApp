import { useState } from 'react';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../stores/auth.store';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setTokens, setUser, logout: clearStore } = useAuthStore();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authApi.login(email, password);
      // Persist to Zustand store
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      toast.success('Successfully logged in');
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, role?: string) => {
    setIsLoading(true);
    try {
      const data = await authApi.register(email, password, role);
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      toast.success('Account created successfully');
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to register');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { refreshToken } = useAuthStore.getState();
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error('Failed to cleanly logout from backend', error);
    } finally {
      clearStore();
      toast.success('Logged out');
      setIsLoading(false);
    }
  };

  return { login, register, logout, isLoading };
};
