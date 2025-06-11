import axios from "axios";
import { LoginInput } from "@/schema/login.schema";
import { User, AuthResponse } from "@/types/auth.types";
import { setCookie } from "@/utils/cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor() {
    super("Access denied. Admin privileges required.");
    this.name = "AuthorizationError";
  }
}

export class AuthService {
  static async login(credentials: LoginInput): Promise<AuthResponse> {
    try {
      // 1. Get access token
      const formData = new URLSearchParams();
      formData.append("username", credentials.email);
      formData.append("password", credentials.password);

      const tokenResponse = await axios.post(`${API_URL}/auth/token`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json",
        },
      });

      if (tokenResponse.status !== 200) {
        throw new AuthenticationError("Invalid credentials");
      }

      const accessToken = tokenResponse.data.access_token;
      const refreshToken = tokenResponse.data.refresh_token;

      // 2. Fetch user profile
      const userResponse = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Accept": "application/json",
        },
      });

      if (userResponse.status !== 200) {
        throw new AuthenticationError("Failed to fetch user profile");
      }

      const user = userResponse.data;

      // 3. Verify admin role
      if (user.role !== 'admin') {
        throw new AuthorizationError();
      }

      // 4. Create auth response and save token
      const authResponse: AuthResponse = {
        user,
        token: accessToken,
        refreshToken: refreshToken,
      };

      // Save tokens in HTTP-only cookies
      setCookie("auth-token", accessToken, 7); // 7 days expiry
      setCookie("refresh-token", refreshToken, 30); // 30 days expiry

      // Also save in localStorage for client-side access
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
      }

      return authResponse;
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw error;
      }
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.detail || "Authentication failed";
        throw new AuthenticationError(message);
      }
      throw new AuthenticationError("Network or server error");
    }
  }

  static async getCurrentUser(token: string): Promise<User> {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });

      const user = response.data;
      
      // Verify admin role
      if (user.role !== 'admin') {
        throw new AuthorizationError();
      }

      return user;
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw error;
      }
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.detail || "Failed to fetch user profile";
        throw new AuthenticationError(message);
      }
      throw new AuthenticationError("Network or server error");
    }
  }

  static async refreshToken(refreshToken: string): Promise<{accessToken: string, refreshToken: string}> {
    try {
      const response = await axios.post(
        `${API_URL}/auth/refresh`,
        { refresh_token: refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new AuthenticationError("Failed to refresh token");
      }

      const newAccessToken = response.data.access_token;
      const newRefreshToken = response.data.refresh_token;

      // Update cookies
      setCookie("auth-token", newAccessToken, 7);
      setCookie("refresh-token", newRefreshToken, 30);

      // Update localStorage for client-side access
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.detail || "Failed to refresh token";
        throw new AuthenticationError(message);
      }
      throw new AuthenticationError("Network or server error during token refresh");
    }
  }

  static async logout(): Promise<void> {
    try {
      // Get refresh token
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
      
      // Make logout request if we have a refresh token
      if (refreshToken) {
        await axios.post(
          `${API_URL}/auth/logout`,
          { refresh_token: refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).catch(err => console.error("Error during logout:", err));
      }
    } finally {
      // Clear cookies
      setCookie("auth-token", "", -1);
      setCookie("refresh-token", "", -1);
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
  }
}
