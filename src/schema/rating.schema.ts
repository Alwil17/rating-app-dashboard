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

export type Rating = z.infer<typeof ratingSchema>;
