'use client';

import { useAuth } from '@/contexts/auth.context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Star, Clock, Plus } from 'lucide-react';
import { useBreadcrumb } from '@/contexts/breadcrumb.context';
import { useEffect } from 'react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { setPageTitle } = useBreadcrumb();

  useEffect(() => {
    setPageTitle('Tableau de bord');
  }, [setPageTitle]);
  
  const stats = [
    {
      label: 'Total Users',
      value: '0',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      label: 'Total Ratings',
      value: '0',
      icon: Star,
      color: 'text-yellow-600',
    },
    {
      label: 'Recent Activity',
      value: '0',
      icon: Clock,
      color: 'text-green-600',
    },
  ];

  const quickActions = [
    {
      label: 'Add User',
      icon: Plus,
      onClick: () => console.log('Add user clicked'),
    },
    {
      label: 'New Rating',
      icon: Star,
      onClick: () => console.log('New rating clicked'),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>
        <p className="text-gray-600 mt-1">Here's what's happening in your system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                onClick={action.onClick}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity (Placeholder) */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <Card className="p-6">
          <p className="text-gray-600">No recent activity to display.</p>
        </Card>
      </div>
    </div>
  );
} 