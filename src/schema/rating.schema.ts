import { z } from "zod";

export const ratingSchema = z.object({
  id: z.number(),
  value: z.number().min(0).max(5),
  comment: z.string().nullable().optional(),
  user_id: z.number(),
  item_id: z.number(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const ratingCreateSchema = z.object({
  value: z.number().min(0).max(5),
  comment: z.string().nullable().optional(),
  user_id: z.number(),
  item_id: z.number(),
});

export const ratingUpdateSchema = z.object({
  value: z.number().min(0).max(5).optional(),
  comment: z.string().nullable().optional(),
});

export type Rating = z.infer<typeof ratingSchema>;
export type RatingCreate = z.infer<typeof ratingCreateSchema>;
export type RatingUpdate = z.infer<typeof ratingUpdateSchema>;
