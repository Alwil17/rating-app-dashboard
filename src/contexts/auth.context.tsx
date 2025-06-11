'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserResponse } from '@/schema/user.schema';
import { TokenResponse } from '@/schema/auth.schema';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize state from localStorage on client-side
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create URLSearchParams object for form data
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const tokenData: TokenResponse = await response.json();
      
      // Store tokens
      setToken(tokenData.access_token);
      setRefreshToken(tokenData.refresh_token);
      localStorage.setItem('token', tokenData.access_token);
      localStorage.setItem('refreshToken', tokenData.refresh_token);
      
      // Fetch user profile
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to get user profile');
      }
      
      const userData: UserResponse = await userResponse.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshAccessToken = async (): Promise<string | null> => {
    if (!refreshToken) return null;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      
      if (!response.ok) {
        // If refresh fails, force logout
        logout();
        return null;
      }
      
      const tokenData: TokenResponse = await response.json();
      
      // Store new tokens
      setToken(tokenData.access_token);
      setRefreshToken(tokenData.refresh_token);
      localStorage.setItem('token', tokenData.access_token);
      localStorage.setItem('refreshToken', tokenData.refresh_token);
      
      return tokenData.access_token;
    } catch (err) {
      console.error('Failed to refresh token:', err);
      logout();
      return null;
    }
  };
  
  const logout = () => {
    // If we have a refresh token, send logout request
    if (refreshToken) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }).catch(err => {
        console.error('Error during logout:', err);
      });
    }
    
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  const contextValue = React.useMemo(() => ({
    user,
    token,
    refreshToken,
    isLoading,
    error,
    login,
    logout,
    refreshAccessToken
  }), [user, token, refreshToken, isLoading, error, login, logout, refreshAccessToken]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}