'use client';

import { withAuth } from '@/components/auth/with-auth';
import { withAdminGuard } from '@/components/auth/role-guard';
import { useAuth } from '@/contexts/auth.context';
import { useLogout } from '@/hooks/queries/use-auth.query';
import { routes } from '@/config/routes';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Separator } from '@radix-ui/react-separator';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { PiGauge } from "react-icons/pi";
import UserDropdown from '@/components/layout/user.dropdown';
import { ModeToggle } from '@/components/layout/mode-toggle';

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
      <SidebarInset className="overflow-hidden px-4 md:px-6 lg:px-8">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger className="-ms-4" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href={routes.admin.home}>
                      <PiGauge size={22} aria-hidden="true" />
                      <span className="sr-only">Dashboard</span>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Années Académiques</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex gap-3 ml-auto">
              <ModeToggle />
              <UserDropdown />
            </div>
          </header>
          {children}
        </SidebarInset>
    </SidebarProvider>
  );
}

// Apply both authentication and admin role guards
export default withAuth(withAdminGuard(AdminLayout)); 