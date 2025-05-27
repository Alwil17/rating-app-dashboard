'use client';

import { withAuth } from '@/components/auth/with-auth';
import { withAdminGuard } from '@/components/auth/role-guard';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { BreadcrumbProvider } from '@/contexts/breadcrumb.context';
import AdminHeader from './components/admin-header';

function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <BreadcrumbProvider>
        <AppSidebar />
        <SidebarInset className="overflow-hidden px-4 md:px-6 lg:px-8">
          <AdminHeader />
          {children}
        </SidebarInset>
      </BreadcrumbProvider>
    </SidebarProvider>
  );
}

// Apply both authentication and admin role guards
export default withAuth(withAdminGuard(AdminLayout)); 