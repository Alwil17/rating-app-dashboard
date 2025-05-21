import { useEffect, useState } from "react";
import { getCurrentUser } from "@/server/services/auth.service";
import { User } from "@/types/auth.types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    getCurrentUser(token)
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return user;
}