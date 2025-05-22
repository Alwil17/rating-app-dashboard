'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth.context';
import { isAdmin } from '@/types/auth.types';
import { routes } from '@/config/routes';

export function NavMenu() {
  const { user } = useAuth();

  return (
    <nav className="space-y-2">
      {/* Common routes for all authenticated users */}
      <Link href={routes.admin.home} className="block p-2 hover:bg-gray-100 rounded">
        Dashboard
      </Link>
      <Link href={routes.admin.profile} className="block p-2 hover:bg-gray-100 rounded">
        Profile
      </Link>

      {/* Admin only routes */}
      {isAdmin(user) && (
        <>
          <Link href="/admin" className="block p-2 hover:bg-gray-100 rounded">
            Admin Dashboard
          </Link>
          <Link href="/admin/users" className="block p-2 hover:bg-gray-100 rounded">
            User Management
          </Link>
          <Link href="/admin/settings" className="block p-2 hover:bg-gray-100 rounded">
            System Settings
          </Link>
        </>
      )}
    </nav>
  );
} 