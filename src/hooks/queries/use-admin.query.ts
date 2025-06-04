import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserCreate, UserUpdate, UserResponse } from "@/schema/user.schema";
import api from "@/utils/axios";
import { adminQueryKeys } from "../useAdminMutations";
import { toast } from "sonner";

export function useCreateAdminMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UserCreate) => {
      const response = await api.post<UserResponse>("/users", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.all });
      toast.success("Admin created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create admin: ${(error as Error).message}`);
    },
  });
}

export function useUpdateAdminMutation(userId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UserUpdate) => {
      const response = await api.put<UserResponse>(`/users/${userId}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.detail(userId) });
      toast.success("Admin updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update admin: ${(error as Error).message}`);
    },
  });
}

export const useDeleteUserMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/users/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success("User deleted successfully");
        },
        onError: (error) => {
            toast.error(`Failed to delete user: ${(error as Error).message}`);
        },
    });
};