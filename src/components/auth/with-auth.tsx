import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth.context';
import { routes } from '@/config/routes';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: { requireAuth?: boolean; redirectTo?: string } = {}
) {
  return function WithAuthComponent(props: P) {
    const { requireAuth = true, redirectTo = routes.auth.login } = options;
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
      if (!isLoading) {
        if (requireAuth && !isAuthenticated) {
          router.replace(redirectTo);
        } else if (!requireAuth && isAuthenticated) {
          router.replace(routes.board.home);
        }
      }
    }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

    if (isLoading) {
      return (
        <div className="flex h-screen w-screen items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    if (requireAuth && !isAuthenticated) {
      return null;
    }

    if (!requireAuth && isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
} 