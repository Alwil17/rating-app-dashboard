import { z } from "zod";

export const tokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.string(),
});

export const refreshTokenSchema = z.object({
  refresh_token: z.string(),
});

export type TokenResponse = z.infer<typeof tokenSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>;
