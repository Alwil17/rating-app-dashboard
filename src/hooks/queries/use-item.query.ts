import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ItemResponse, ItemCreate, ItemUpdate } from "@/schema/item.schema";
import api from "@/utils/axios";
import { toast } from "sonner";

// Query keys
export const itemKeys = {
  all: ['items'] as const,
  lists: () => [...itemKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...itemKeys.lists(), { ...filters }] as const,
  details: () => [...itemKeys.all, 'detail'] as const,
  detail: (id: number) => [...itemKeys.details(), id] as const,
};

// Get all items
export const useItems = (filters?: { category_id?: number, tags?: string[] }) => {
  return useQuery({
    queryKey: itemKeys.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters?.category_id) {
        params.append('category_id', filters.category_id.toString());
      }
      
      if (filters?.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => params.append('tags', tag));
      }
      
      const response = await api.get<ItemResponse[]>('/items', { 
        params: filters && Object.keys(filters).length > 0 ? params : undefined 
      });
      return response.data;
    }
  });
};

// Get a specific item
export const useItem = (id: number) => {
  return useQuery({
    queryKey: itemKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<ItemResponse>(`/items/${id}`);
      return response.data;
    },
    enabled: !!id
  });
};

// Create an item
export const useCreateItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newItem: ItemCreate) => {
      const response = await api.post<ItemResponse>('/items', newItem);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
      toast.success('Item created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create item: ${(error as Error).message}`);
    }
  });
};

// Update an item
export const useUpdateItemMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedItem: ItemUpdate) => {
      const response = await api.put<ItemResponse>(`/items/${id}`, updatedItem);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
      toast.success('Item updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update item: ${(error as Error).message}`);
    }
  });
};

// Delete an item
export const useDeleteItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
      toast.success('Item deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete item: ${(error as Error).message}`);
    }
  });
};

// Update item categories
export const useUpdateItemCategoriesMutation = (itemId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryIds: number[]) => {
      await api.put(`/items/${itemId}/categories`, categoryIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(itemId) });
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
      toast.success('Item categories updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update item categories: ${(error as Error).message}`);
    }
  });
};

// Update item tags
export const useUpdateItemTagsMutation = (itemId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagNames: string[]) => {
      await api.put(`/items/${itemId}/tags`, tagNames);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(itemId) });
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
      toast.success('Item tags updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update item tags: ${(error as Error).message}`);
    }
  });
};
