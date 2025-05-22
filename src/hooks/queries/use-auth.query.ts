'use client';

import { LoginInput } from "@/schema/login.schema";
import { AuthService } from "@/server/services/auth.service";
import { AuthResponse } from "@/types/auth.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthToken } from "@/utils/auth-utils";

export const authQueryKeys = {
  user: ['auth', 'user'] as const,
  session: ['auth', 'session'] as const,
};

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginInput) => AuthService.login(credentials),
    onSuccess: (data) => {
      // Update the user data in the cache
      queryClient.setQueryData(authQueryKeys.user, data);
    },
    onError: (error) => {
      // Invalidate the cache on error
      queryClient.invalidateQueries({ queryKey: authQueryKeys.user });
      throw error;
    },
  });
}

export function useCurrentUser() {
  const token = getAuthToken();

  return useQuery({
    queryKey: authQueryKeys.user,
    queryFn: async () => {
      if (!token) return null;
      
      try {
        const user = await AuthService.getCurrentUser(token);
        return { user, token };
      } catch (error) {
        // If there's an error fetching the user, clear the token
        AuthService.logout();
        return null;
      }
    },
    enabled: !!token, // Only run the query if we have a token
    staleTime: 1000 * 60 * 5, // Consider the data stale after 5 minutes
    retry: false, // Don't retry on error
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      // Clear the user data from the cache
      queryClient.setQueryData(authQueryKeys.user, null);
      // Invalidate all queries
      queryClient.invalidateQueries();
    },
  });
}