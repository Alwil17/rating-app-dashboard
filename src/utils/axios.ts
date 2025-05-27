import axios from "axios";
import { getCookie } from "./cookies";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to handle auth token from cookies
api.interceptors.request.use(
  (config) => {
    const token = getCookie("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error.message ?? String(error)));
  }
);

// Response interceptor with error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    /* if (error.response?.status === 401) {
      // Optionally redirect to login or handle token expiration
      window.location.href = '/auth/login';
    } */

    console.log(error);
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });

    return Promise.reject(error);
  }
);

export default api;