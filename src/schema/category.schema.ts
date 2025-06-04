import { z } from "zod";

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
});

export const categoryCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
});

export const categoryUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().nullable().optional(),
});

export type Category = z.infer<typeof categorySchema>;
export type CategoryCreate = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdate = z.infer<typeof categoryUpdateSchema>;
