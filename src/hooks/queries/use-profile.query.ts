import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserResponse, UserUpdate } from "@/schema/user.schema";
import api from "@/utils/axios";
import { toast } from "sonner";

// Query keys
export const profileKeys = {
  all: ['profile'] as const,
  current: () => [...profileKeys.all, 'me'] as const,
};

// Get current user profile
export const useProfile = () => {
  return useQuery({
    queryKey: profileKeys.current(),
    queryFn: async () => {
      const response = await api.get<UserResponse>('/auth/me');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Update current user profile
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: UserUpdate) => {
      const response = await api.put<UserResponse>('/auth/edit', userData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.current(), data);
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${(error as Error).message}`);
    }
  });
};

// Delete current user account
export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.delete('/auth/remove');
    },
    onSuccess: () => {
      // Invalidate and remove all queries to force refresh
      queryClient.clear();
      // Redirect to login page
      window.location.href = '/auth/login';
      toast.success('Your account has been deleted');
    },
    onError: (error) => {
      toast.error(`Failed to delete account: ${(error as Error).message}`);
    }
  });
};
