'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { routes } from '@/config/routes';
import {
  LayoutDashboard,
  Users,
  Star,
  Settings,
  UserCircle,
} from 'lucide-react';

const navItems = [
  {
    href: routes.admin.home,
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: routes.admin.users,
    label: 'Users',
    icon: Users,
  },
  {
    href: routes.admin.ratings,
    label: 'Ratings',
    icon: Star,
  },
  {
    href: routes.admin.profile,
    label: 'Profile',
    icon: UserCircle,
  },
  {
    href: routes.admin.settings,
    label: 'Settings',
    icon: Settings,
  },
] as const;

export function NavMenu() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
} 