'use client';

import { useAuth } from '@/contexts/auth.context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Star, Clock, Plus, Loader2, ArrowUpRight, TrendingUp, Activity } from 'lucide-react';
import { useBreadcrumb } from '@/contexts/breadcrumb.context';
import { useEffect } from 'react';
import { useStats } from '@/hooks/useStats';
import { useChartData } from '@/hooks/useChartData';
import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart, PieChart, Pie, AreaChart, Area, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { useRouter } from "next/navigation";
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { setPageTitle } = useBreadcrumb();
  const { totalUsers, totalRatings, recentActivity, isLoading, error } = useStats();
  const { ratingsOverTime, usersByItem, ratingsByCategory, isLoading: chartsLoading } = useChartData();
  const router = useRouter();

  useEffect(() => {
    setPageTitle('Dashboard');
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
  } satisfies ChartConfig;

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
    return acc;
  }, []);

  // Sort by date
  formattedRatingsData.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Limit to the latest 10 items
  const formattedUserData = usersByItem.items
    .map((item, index) => ({
      item,
      users: usersByItem.counts[index],
    }))
    .sort((a, b) => b.users - a.users)
    .slice(0, 7);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
  
  const formattedCategoryData = ratingsByCategory.categories.map((category, index) => ({
    name: category,
    value: ratingsByCategory.counts[index],
  }));

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

  const quickActions = [
    {
      label: 'Add User',
      icon: Plus,
      onClick: () => router.push('/admin/users'),
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      label: 'New Item',
      icon: Plus,
      onClick: () => router.push('/admin/items'),
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      label: 'View Ratings',
      icon: Star,
      onClick: () => router.push('/admin/ratings'),
      color: 'bg-amber-500 hover:bg-amber-600',
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

      {/* Stats Grid - Improved with hover effects and links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.label} 
              className="hover:shadow-md transition-all duration-200 group cursor-pointer overflow-hidden relative"
              onClick={() => router.push(stat.link)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pb-2">
                <div className={`p-2 rounded-full w-fit ${stat.bgColor} ${stat.color} mb-2`}>
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="flex items-center justify-between">
                  <span>{stat.label}</span>
                  <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        stat.value
                      )}
                    </span>
                  </div>
                  {error && <p className="text-sm text-destructive mt-1">{error}</p>}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Charts - Improved with tabs and better visualization */}
      <Tabs defaultValue="overview" className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Analytics
          </h2>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ratings Over Time</CardTitle>
              <CardDescription>Daily rating trends</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {chartsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={formattedRatingsData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorRatings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return format(date, 'MMM d');
                      }}
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "0.5rem",
                        boxShadow: "0 1px 2px hsla(var(--shadow))",
                      }}
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return format(date, 'MMMM d, yyyy');
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="ratings" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorRatings)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Items by User Rating</CardTitle>
              <CardDescription>Most popular items</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {chartsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={formattedUserData}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number" 
                      stroke="hsl(var(--muted-foreground))" 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      dataKey="item" 
                      type="category" 
                      width={100}
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "0.5rem",
                        boxShadow: "0 1px 2px hsla(var(--shadow))",
                      }}
                    />
                    <Bar 
                      dataKey="users" 
                      fill="hsl(var(--primary))" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Ratings by Category</CardTitle>
              <CardDescription>Distribution across categories</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {chartsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="flex flex-col md:flex-row h-full">
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={formattedCategoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {formattedCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "0.5rem",
                            boxShadow: "0 1px 2px hsla(var(--shadow))",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {formattedCategoryData.map((category, index) => (
                      <div key={category.name} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                            />
                            <span className="text-sm font-medium">{category.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{category.value}</span>
                        </div>
                        <Progress 
                          value={
                            (category.value / formattedCategoryData.reduce((sum, cat) => sum + cat.value, 0)) * 100
                          } 
                          className="h-2"
                          style={{ ['--progress-indicator-color' as any]: COLORS[index % COLORS.length] }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
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

      {/* Recent Activity - Improved with modern design */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in your system</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/ratings')}>
            View all
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="rounded-full h-8 w-8 flex items-center justify-center bg-primary/10">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">New rating added</p>
                <p className="text-sm text-muted-foreground">
                  User rated Item #12 with 4.5 stars
                </p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full h-8 w-8 flex items-center justify-center bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">New user registered</p>
                <p className="text-sm text-muted-foreground">
                  John Doe joined the platform
                </p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// You can customize the Progress indicator color via the style prop using a CSS variable.