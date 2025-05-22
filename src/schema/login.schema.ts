import { messages } from "@/config/messages";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, messages.auth.email.required).email({ message: messages.auth.email.invalid }),
  password: z.string().min(1, messages.auth.password.required)
  .max(50, { message: messages.auth.password.tooLong }),
});

export type LoginInput = z.infer<typeof loginSchema>;