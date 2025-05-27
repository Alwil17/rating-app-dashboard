'use client';

import { withAuth } from '@/components/auth/with-auth';
import { withAdminGuard } from '@/components/auth/role-guard';
import { useAuth } from '@/contexts/auth.context';
import { useLogout } from '@/hooks/queries/use-auth.query';
import { routes } from '@/config/routes';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { mutate: logout } = useLogout();
  const router = useRouter();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.replace(routes.auth.login);
      },
    });
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}

// Apply both authentication and admin role guards
export default withAuth(withAdminGuard(AdminLayout)); 