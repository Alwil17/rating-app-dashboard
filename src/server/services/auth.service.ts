import axios from "axios";
import { LoginInput } from "@/schema/login.schema";
import { User, AuthResponse } from "@/types/auth.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function login(payload: LoginInput): Promise<AuthResponse> {
  const params = new URLSearchParams();
  params.append("username", payload.username);
  params.append("password", payload.password);

  const response = await axios.post(`${API_URL}/auth/token`, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data;
}

export async function getCurrentUser(token: string): Promise<User> {
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}