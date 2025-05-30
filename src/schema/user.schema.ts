import { z } from "zod";

export const userCreateSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  role: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
});

export const userResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.string().nullable(),
  image_url: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type UserCreate = z.infer<typeof userCreateSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
