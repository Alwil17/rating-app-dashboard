import { z } from "zod";

export const tagSchema = z.object({
  id: z.number(),
  name: z.string()
});

export const tagCreateSchema = z.object({
  name: z.string().min(1)
});

export const tagUpdateSchema = z.object({
  name: z.string().optional()
});

export type Tag = z.infer<typeof tagSchema>;
export type TagCreate = z.infer<typeof tagCreateSchema>;
export type TagUpdate = z.infer<typeof tagUpdateSchema>;
