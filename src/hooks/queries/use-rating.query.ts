import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Rating } from "@/schema/rating.schema";
import api from "@/utils/axios";
import { toast } from "sonner";

// Query keys
export const ratingKeys = {
  all: ['ratings'] as const,
  lists: () => [...ratingKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...ratingKeys.lists(), { ...filters }] as const,
  details: () => [...ratingKeys.all, 'detail'] as const,
  detail: (id: number) => [...ratingKeys.details(), id] as const,
  byItem: (itemId: number) => [...ratingKeys.all, 'byItem', itemId] as const,
  byUser: (userId: number) => [...ratingKeys.all, 'byUser', userId] as const,
};

// Get all ratings
export const useRatings = () => {
  return useQuery({
    queryKey: ratingKeys.lists(),
    queryFn: async () => {
      const response = await api.get<Rating[]>('/ratings');
      return response.data;
    }
  });
};

// Get a specific rating
export const useRating = (id: number) => {
  return useQuery({
    queryKey: ratingKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Rating>(`/ratings/${id}`);
      return response.data;
    },
    enabled: !!id
  });
};

// Get ratings for an item
export const useItemRatings = (itemId: number) => {
  return useQuery({
    queryKey: ratingKeys.byItem(itemId),
    queryFn: async () => {
      const response = await api.get<Rating[]>(`/items/${itemId}/ratings`);
      return response.data;
    },
    enabled: !!itemId
  });
};

// Get ratings by a user
export const useUserRatings = (userId: number) => {
  return useQuery({
    queryKey: ratingKeys.byUser(userId),
    queryFn: async () => {
      const response = await api.get<Rating[]>(`/users/${userId}/ratings`);
      return response.data;
    },
    enabled: !!userId
  });
};

// Delete a rating
export const useDeleteRatingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rating: Rating) => {
      await api.delete(`/ratings/${rating.id}/comment`);
      return rating; // Return rating to use in onSuccess
    },
    onSuccess: (rating) => {
      queryClient.invalidateQueries({ queryKey: ratingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ratingKeys.byItem(rating.item_id) });
      queryClient.invalidateQueries({ queryKey: ratingKeys.byUser(rating.user_id) });
      toast.success('Rating deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete rating: ${(error as Error).message}`);
    }
  });
};
