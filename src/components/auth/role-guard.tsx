'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth.context';
import { UserRole } from '@/types/auth.types';
import { routes } from '@/config/routes';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

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
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.replace(routes.auth.login);
      } else if (!allowedRoles.includes(user.role)) {
        router.replace(fallbackPath);
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, fallbackPath, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Don't render anything while redirecting
  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
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
      <RoleGuard allowedRoles={['admin']} fallbackPath={options.fallbackPath}>
        <WrappedComponent {...props} />
      </RoleGuard>
    );
  };
}

// Remove teacher guard since we don't have teacher role in our types
export function withUserGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: { fallbackPath?: string } = {}
) {
  return function WithUserGuard(props: P) {
    return (
      <RoleGuard allowedRoles={['user', 'admin']} fallbackPath={options.fallbackPath}>
        <WrappedComponent {...props} />
      </RoleGuard>
    );
  };
} 