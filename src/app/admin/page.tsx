'use client';

import { useAuth } from '@/contexts/auth.context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Star, Clock, Plus, Loader2 } from 'lucide-react';
import { useBreadcrumb } from '@/contexts/breadcrumb.context';
import { useEffect } from 'react';
import { useStats } from '@/hooks/useStats';
import { useChartData } from '@/hooks/useChartData';

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart, PieChart, Pie } from "recharts"
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { setPageTitle } = useBreadcrumb();
  const { totalUsers, totalRatings, recentActivity, isLoading, error } = useStats();
  const { ratingsOverTime, usersByItem, ratingsByCategory, isLoading: chartsLoading } = useChartData();

  useEffect(() => {
    setPageTitle('Tableau de bord');
  }, [setPageTitle]);

  const chartConfig = {
    ratings: {
      label: "Ratings",
      color: "hsl(var(--chart-1))",
    },
    users: {
      label: "Users",
      color: "hsl(var(--chart-2))",
    },
  };

  // Transform data for Recharts - Group by month
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
    console.log('Formatted Ratings Data 1 :', acc);
    return acc;
  }, []);

  // Sort by date
  formattedRatingsData.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const formattedUserData = usersByItem.items.map((item, index) => ({
    item,
    users: usersByItem.counts[index],
  }));

  const formattedCategoryData = ratingsByCategory.categories.map((category, index) => ({
    name: category,
    value: ratingsByCategory.counts[index],
  }));

  const stats = [
    {
      label: 'Total Users',
      value: isLoading ? '-' : totalUsers.toString(),
      icon: Users,
      color: 'text-blue-600',
    },
    {
      label: 'Total Ratings',
      value: isLoading ? '-' : totalRatings.toString(),
      icon: Star,
      color: 'text-yellow-600',
    },
    {
      label: 'Recent Activity',
      value: isLoading ? '-' : recentActivity.toString(),
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
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                  {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Ratings Over Time</CardTitle>
            <CardDescription>Daily rating trends</CardDescription>
          </CardHeader>
          <CardContent>
            {chartsLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <ChartContainer config={chartConfig}>
                <BarChart
                  width={500}
                  height={300}
                  data={formattedRatingsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar dataKey="ratings" stroke="var(--chart-1)" radius={4} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users per Item</CardTitle>
            <CardDescription>Distribution of users across items</CardDescription>
          </CardHeader>
          <CardContent>
            {chartsLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <ChartContainer config={chartConfig}>
                <BarChart
                  width={500}
                  height={300}
                  data={formattedUserData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="item"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="users" fill="var(--chart-1)" radius={4} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ratings by Category</CardTitle>
            <CardDescription>Distribution across categories</CardDescription>
          </CardHeader>
          <CardContent>
            {chartsLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <PieChart width={400} height={300}>
                <Pie
                  data={formattedCategoryData}
                  cx={200}
                  cy={150}
                  outerRadius={100}
                  fill="var(--chart-1)"
                  dataKey="value"
                  label
                />
                <ChartTooltip />
              </PieChart>
            )}
          </CardContent>
        </Card>
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