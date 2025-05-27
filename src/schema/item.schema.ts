import { z } from "zod";

export const itemCreateSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  category_ids: z.array(z.number().int()).optional().default([]),
  tags: z.array(z.string()).optional().default([])
});

export const itemUpdateSchema = z.object({
  name: z.string().max(200).optional(),
  image_url: z.string().url().nullable(),
  description: z.string().nullable().optional(),
});

export const itemResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  image_url: z.string().nullable(),
  categories: z.array(z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable()
  })).default([]),
  tags: z.array(z.object({
    id: z.number(),
    name: z.string()
  })).default([]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  avg_rating: z.number().default(0),
  count_rating: z.number().default(0)
});

export type ItemCreate = z.infer<typeof itemCreateSchema>;
export type ItemUpdate = z.infer<typeof itemUpdateSchema>;
export type ItemResponse = z.infer<typeof itemResponseSchema>;