import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/auth.store';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4500/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR 1: Attach Access Token to every outbound request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Zustand allows reading state outside of React components using getState()
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// QUEUE PATTERN FOR REFRESH TOKENS
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// INTERCEPTOR 2: Global Error Handler & Silent Token Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If the error isn't 401, or it's already been retried, just throw it
    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Mark request as retried so we don't infinitely loop
    originalRequest._retry = true;

    // If a refresh is already happening, queue this request until the refresh finishes
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;
    const authStore = useAuthStore.getState();

    try {
      if (!authStore.refreshToken) {
        throw new Error('No refresh token available');
      }

      // Call the NestJS refresh endpoint
      const response = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {
        refreshToken: authStore.refreshToken,
      });

      const { accessToken } = response.data;
      
      // Update global store
      authStore.setTokens(accessToken, authStore.refreshToken);

      // Process all other queued requests
      processQueue(null, accessToken);

      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      // If refresh completely fails, logout the user
      processQueue(refreshError, null);
      authStore.logout();
      // Optional: force redirect to login
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
