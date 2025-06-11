import axios from 'axios';
import { logAuthDebug } from './debug';

// Extend AxiosInstance to include authGet
declare module 'axios' {
  export interface AxiosInstance {
    authGet?: (url: string) => Promise<any>;
  }
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Set up request interceptor for authentication
api.interceptors.request.use(
  async (config) => {
    // Skip if this is the refresh token or auth token request
    if (config.url?.includes('/auth/refresh') || config.url?.includes('/auth/token')) {
      return config;
    }
    
    // Client-side only
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        logAuthDebug('Adding token to request', { url: config.url });
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        logAuthDebug('No token found for request', { url: config.url });
      }
    }
    return config;
  },
  (error) => {
    logAuthDebug('Request interceptor error', error);
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

// Set up response interceptor for token refresh
let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: unknown, token: unknown) => {
  failedQueue.forEach(prom => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    logAuthDebug('Response error intercepted', {
      status: error.response?.status,
      url: error.config?.url
    });
    
    const originalRequest = error.config;
    
    // If error is unauthorized and not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      logAuthDebug('401 detected, attempting refresh', { url: originalRequest.url });
      
      if (isRefreshing) {
        logAuthDebug('Already refreshing, adding to queue');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err instanceof Error ? err : new Error(String(err)));
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          logAuthDebug('No refresh token available');
          window.location.href = '/auth/login';
          return Promise.reject(error instanceof Error ? error : new Error(String(error)));
        }
        
        logAuthDebug('Attempting token refresh');
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refresh_token: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        if (response.status === 200) {
          const { access_token, refresh_token } = response.data;
          logAuthDebug('Token refresh successful');
          
          localStorage.setItem('token', access_token);
          localStorage.setItem('refreshToken', refresh_token);
          
          // Update all queued requests with new token
          processQueue(null, access_token);
          
          // Update this request with new token
          originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (err) {
        logAuthDebug('Token refresh failed', err);
        processQueue(err, null);
        
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Redirect to login
        window.location.href = '/auth/login';
        return Promise.reject(error instanceof Error ? error : new Error(String(error)));
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

// Add a specific method for authenticated requests
api.authGet = async (url: string) => {
  try {
    return await api.get(url);
  } catch (error) {
    logAuthDebug('authGet error', { url, error });
    throw error;
  }
};

export default api;