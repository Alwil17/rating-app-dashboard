import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Category, CategoryCreate, CategoryUpdate } from "@/schema/category.schema";
import api from "@/utils/axios";
import { toast } from "sonner";

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...categoryKeys.lists(), { ...filters }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
};

// Get all categories
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: async () => {
      const response = await api.get<Category[]>('/categories');
      return response.data;
    }
  });
};

// Get a specific category
export const useCategory = (id: number) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Category>(`/categories/${id}`);
      return response.data;
    },
    enabled: !!id
  });
};

// Create a category
export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCategory: CategoryCreate) => {
      const response = await api.post<Category>('/categories', newCategory);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success('Category created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create category: ${(error as Error).message}`);
    }
  });
};

// Update a category
export const useUpdateCategoryMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedCategory: CategoryUpdate) => {
      const response = await api.put<Category>(`/categories/${id}`, updatedCategory);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success('Category updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update category: ${(error as Error).message}`);
    }
  });
};

// Delete a category
export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete category: ${(error as Error).message}`);
    }
  });
};
