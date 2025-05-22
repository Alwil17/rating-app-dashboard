'use client';

import { createContext, useContext, ReactNode } from 'react';
import { User } from '@/types/auth.types';
import { useCurrentUser } from '@/hooks/queries/use-auth.query';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading, error } = useCurrentUser();

  const value = {
    user: user?.user ?? null,
    isLoading,
    isAuthenticated: !!user?.user,
    error: error as Error | null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 