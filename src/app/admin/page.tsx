'use client';

import { useAuth } from '@/contexts/auth.context';
import { useBreadcrumb } from '@/contexts/breadcrumb.context';
import { useEffect } from 'react';
import { useStats } from '@/hooks/useStats';
import { useChartData } from '@/hooks/useChartData';
import { Users, Star, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Import extracted components
import { StatsCards } from './components/stats-cards';
import { RatingTrendChart } from './components/rating-trend-chart';
import { TopItemsChart } from './components/top-items-chart';
import { CategoryDistributionChart } from './components/category-distribution-chart';
import { RecentActivity } from './components/recent-activity';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { setPageTitle } = useBreadcrumb();
  const { totalUsers, totalRatings, recentActivity, isLoading, error } = useStats();
  const { ratingsOverTime, usersByItem, ratingsByCategory, isLoading: chartsLoading } = useChartData();
  const router = useRouter();

  useEffect(() => {
    setPageTitle('Dashboard');
  }, [setPageTitle]);

  // Transform data for charts
  const formattedRatingsData = ratingsOverTime.dates.reduce((acc: any[], incomingDate, index) => {
    const [day, month, year] = incomingDate.split("/");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    const monthDate = new Date(date);
    const monthKey = monthDate.toLocaleDateString('en-US');
    const existingMonth = acc.find(item => item.date === monthKey);
    if (existingMonth) {
      existingMonth.ratings += ratingsOverTime.values[index];
    } else {
      acc.push({
        month: monthKey,
        ratings: ratingsOverTime.values[index],
      });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Format data for top items chart
  const formattedUserData = usersByItem.items
    .map((item, index) => ({
      item,
      users: usersByItem.counts[index],
    }))
    .sort((a, b) => b.users - a.users)
    .slice(0, 7);

  // Format data for category distribution
  const formattedCategoryData = ratingsByCategory.categories.map((category, index) => ({
    name: category,
    value: ratingsByCategory.counts[index],
  }));

  // Stats cards data
  const stats = [
    {
      label: 'Total Users',
      value: isLoading ? '-' : totalUsers.toString(),
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      link: '/admin/users',
    },
    {
      label: 'Total Ratings',
      value: isLoading ? '-' : totalRatings.toString(),
      icon: Star,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      link: '/admin/ratings',
    },
    {
      label: 'Recent Activity',
      value: isLoading ? '-' : recentActivity.toString(),
      icon: Activity,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950',
      link: '/admin/ratings',
    },
  ];

  return (
    <div>
      {/* Header with welcome and time of day greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {getGreeting()}, {user?.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your system's performance and recent activity.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} isLoading={isLoading} error={error} />

      {/* Charts - Using extracted components */}
      <Tabs defaultValue="overview" className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Analytics</h2>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RatingTrendChart 
            data={formattedRatingsData} 
            isLoading={chartsLoading} 
          />
          
          <TopItemsChart 
            data={formattedUserData} 
            isLoading={chartsLoading} 
          />
          
          <CategoryDistributionChart 
            data={formattedCategoryData} 
            isLoading={chartsLoading} 
          />
        </TabsContent>

        <TabsContent value="ratings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Rating Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>More detailed rating analytics will be displayed here.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => router.push('/admin/ratings')}>
                View All Ratings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>User growth and engagement analytics will be displayed here.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => router.push('/admin/users')}>
                View All Users
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}