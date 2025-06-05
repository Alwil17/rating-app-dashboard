import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tag, TagCreate, TagUpdate } from "@/schema/tag.schema";
import api from "@/utils/axios";
import { toast } from "sonner";

// Query keys
export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...tagKeys.lists(), { ...filters }] as const,
  details: () => [...tagKeys.all, 'detail'] as const,
  detail: (id: number) => [...tagKeys.details(), id] as const,
};

// Get all tags
export const useTags = () => {
  return useQuery({
    queryKey: tagKeys.lists(),
    queryFn: async () => {
      const response = await api.get<Tag[]>('/tags');
      return response.data;
    }
  });
};

// Get a specific tag
export const useTag = (id: number) => {
  return useQuery({
    queryKey: tagKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Tag>(`/tags/${id}`);
      return response.data;
    },
    enabled: !!id
  });
};

// Create a tag
export const useCreateTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTag: TagCreate) => {
      const response = await api.post<Tag>('/tags', newTag);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
      toast.success('Tag created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create tag: ${(error as Error).message}`);
    }
  });
};

// Update a tag
export const useUpdateTagMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedTag: TagUpdate) => {
      const response = await api.put<Tag>(`/tags/${id}`, updatedTag);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
      toast.success('Tag updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update tag: ${(error as Error).message}`);
    }
  });
};

// Delete a tag
export const useDeleteTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/tags/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
      toast.success('Tag deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete tag: ${(error as Error).message}`);
    }
  });
};
