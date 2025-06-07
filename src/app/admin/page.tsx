'use client';

import { useAuth } from '@/contexts/auth.context';
import { useBreadcrumb } from '@/contexts/breadcrumb.context';
import { useEffect } from 'react';
import { useStats } from '@/hooks/useStats';
import { useChartData } from '@/hooks/useChartData';
import { Users, Star, Activity, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      label: 'Recent Ratings',
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
            <CardContent className="space-y-6">
              {chartsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <>
                  {/* Rating Distribution */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Rating Distribution</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        // Calculate number of ratings for this score
                        const count = Math.floor(Math.random() * 100); // Replace with actual data
                        const percentage = count / 100 * 100;
                        
                        return (
                          <div key={rating} className="flex flex-col items-center">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className={`h-4 w-4 ${rating >= 4 ? 'text-yellow-500 fill-yellow-500' : 
                                rating === 3 ? 'text-yellow-400 fill-yellow-400' : 'text-red-400 fill-red-400'}`} />
                              <span>{rating}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 mb-1">
                              <div 
                                className={`h-2 rounded-full ${
                                  rating >= 4 ? 'bg-green-500' :
                                  rating === 3 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-muted-foreground">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Recent Rating Activity */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Recent Rating Activity</h3>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between border-b pb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>U{i}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">User {i}</p>
                              <p className="text-xs text-muted-foreground">Item {i+3}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {Array(5).fill(0).map((_, index) => (
                              <Star 
                                key={index} 
                                className={`h-3 w-3 ${index < 5-i ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} 
                              />
                            ))}
                            <span className="ml-2 text-sm text-muted-foreground">{Math.floor(Math.random() * 24) + 1}h ago</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Rating Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Average Rating</h4>
                      <div className="flex items-center">
                        <div className="text-2xl font-bold mr-2">4.3</div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star 
                              key={i}
                              className={`h-4 w-4 ${i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-yellow-400 fill-yellow-400 opacity-30'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Based on {totalRatings} ratings</p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Top Rated Category</h4>
                      <div className="text-lg font-semibold">
                        {formattedCategoryData.length > 0 ? 
                          formattedCategoryData.sort((a, b) => b.value - a.value)[0].name : 
                          "No data"}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Most popular among users</p>
                    </div>
                  </div>
                </>
              )}
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
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}