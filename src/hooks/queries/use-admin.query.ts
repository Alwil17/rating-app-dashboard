import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserCreate, UserUpdate } from "@/schema/user.schema";
import api from "@/utils/axios";
import { UserResponse } from "@/schema/user.schema";
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
