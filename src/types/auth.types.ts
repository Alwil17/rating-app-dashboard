export type UserRole = 'admin' | 'user';

export interface AuthResponse {
  user: User;
  token: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
}

// Helper type for role checks
export const ADMIN_ROLES: UserRole[] = ['admin'];

export function isAdmin(user: User | null): boolean {
  return !!user && ADMIN_ROLES.includes(user.role);
}
