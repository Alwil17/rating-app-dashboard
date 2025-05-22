'use client';

import { withAuth } from '@/components/auth/with-auth';
import { withAdminGuard } from '@/components/auth/role-guard';
import { NavMenu } from '@/components/layout/nav-menu';
import { useAuth } from '@/contexts/auth.context';
import { useLogout } from '@/hooks/queries/use-auth.query';
import { routes } from '@/config/routes';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r min-h-screen">
        {/* Logo/Header */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold">Rating Admin</h1>
        </div>

        {/* User Info */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-full">
              <User size={20} />
            </div>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <NavMenu />
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t mt-auto">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

// Apply both authentication and admin role guards
export default withAuth(withAdminGuard(AdminLayout)); 