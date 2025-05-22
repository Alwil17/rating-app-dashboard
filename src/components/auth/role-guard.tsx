'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth.context';
import { UserRole, isAdmin } from '@/types/auth.types';
import { routes } from '@/config/routes';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallbackPath = routes.admin.home,
}: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // If user is not authenticated, they shouldn't be here anyway
  if (!isAuthenticated || !user) {
    router.replace(routes.auth.login);
    return null;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {
    router.replace(fallbackPath);
    return null;
  }

  return <>{children}</>;
}

// Convenience HOC for admin-only routes
export function withAdminGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: { fallbackPath?: string } = {}
) {
  return function WithAdminGuard(props: P) {
    return (
      <RoleGuard allowedRoles={['user']} fallbackPath={options.fallbackPath}>
        <WrappedComponent {...props} />
      </RoleGuard>
    );
  };
}

// Convenience HOC for teacher/admin routes
export function withTeacherGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: { fallbackPath?: string } = {}
) {
  return function WithTeacherGuard(props: P) {
    return (
      <RoleGuard allowedRoles={['user']} fallbackPath={options.fallbackPath}>
        <WrappedComponent {...props} />
      </RoleGuard>
    );
  };
} 