'use client';

import { withAuth } from '@/components/auth/with-auth';
import { withAdminGuard } from '@/components/auth/role-guard';

function AdminDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>This page is only accessible to administrators.</p>
    </div>
  );
}

// Compose the guards: first check auth, then check admin role
export default withAuth(
  withAdminGuard(AdminDashboardPage, {
    fallbackPath: '/board' // Redirect to main dashboard if not admin
  })
); 