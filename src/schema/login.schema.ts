import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
  .max(50, { message: "Password must be less than 50 characters" }),
});

export type LoginInput = z.infer<typeof loginSchema>;