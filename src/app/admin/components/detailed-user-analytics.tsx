"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, TrendingUp, Activity, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/axios";
import { AreaChart, BarChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar } from "recharts";
import { format, subDays } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserGrowthData {
  date: string;
  count: number;
}

interface UserEngagementData {
  user_id: number;
  username: string;  // Changed from user_name to match backend
  ratings_count: number; // Changed from rating_count to match backend
  last_activity: string; // Added to match backend
}

interface UserStats {
  total_users: number;
  active_users: number;
  new_users_today: number;
  average_ratings_per_user: number;
}

export function DetailedUserAnalytics() {
  const router = useRouter();
  
  // User growth over time
  const { data: userGrowth, isLoading: growthLoading } = useQuery({
    queryKey: ['user-growth'],
    queryFn: async () => {
      try {
        const response = await api.get<UserGrowthData[]>('/users/growth');
        return response.data;
      } catch (error) {
        console.error("Error fetching user growth:", error);
        // Generate placeholder data for development
        return generateUserGrowthData();
      }
    }
  });

  // Most engaged users
  const { data: userEngagement, isLoading: engagementLoading } = useQuery({
    queryKey: ['user-engagement'],
    queryFn: async () => {
      try {
        const response = await api.get<UserEngagementData[]>('/users/engagement');
        return response.data;
      } catch (error) {
        console.error("Error fetching user engagement:", error);
        // Generate placeholder data for development
        return generateEngagementData();
      }
    }
  });

  // User statistics
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      try {
        const response = await api.get<UserStats>('/users/stats');
        return response.data;
      } catch (error) {
        console.error("Error fetching user stats:", error);
        // Generate placeholder data for development
        return {
          total_users: 324,
          active_users: 156,
          new_users_today: 8,
          average_ratings_per_user: 4.2
        };
      }
    }
  });

  const isLoading = growthLoading || engagementLoading || statsLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            {/* User Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title="Total Users" 
                value={userStats?.total_users || 0} 
                icon={<Users className="h-5 w-5" />}
                description="All time"
                color="bg-blue-50 text-blue-600"
              />
              <MetricCard 
                title="Active Users" 
                value={userStats?.active_users || 0} 
                icon={<Activity className="h-5 w-5" />}
                description="Last 30 days"
                color="bg-green-50 text-green-600"
              />
              <MetricCard 
                title="New Users" 
                value={userStats?.new_users_today || 0} 
                icon={<UserPlus className="h-5 w-5" />}
                description="Today"
                color="bg-purple-50 text-purple-600"
              />
              <MetricCard 
                title="Avg. Ratings" 
                value={userStats?.average_ratings_per_user || 0} 
                icon={<TrendingUp className="h-5 w-5" />}
                description="Per user"
                color="bg-amber-50 text-amber-600"
                isDecimal
              />
            </div>

            {/* User Growth Chart */}
            <div>
              <h3 className="text-lg font-medium mb-3">User Growth</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={userGrowth}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => format(new Date(value), 'MMM d')}
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
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
                      labelFormatter={(value) => format(new Date(value), 'MMMM d, yyyy')}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorUsers)"
                      name="Users" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Most Active Users */}
            <div>
              <h3 className="text-lg font-medium mb-3">Most Active Users</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={userEngagement?.slice(0, 5)} // Top 5 users
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
                      dataKey="username" 
                      type="category" 
                      width={100}
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={false}
                      tick={(props) => {
                        const { x, y, payload } = props;
                        const user = userEngagement?.find(u => u.username === payload.value);
                        return (
                          <g transform={`translate(${x},${y})`}>
                            <foreignObject width="100" height="30" x={-100} y={-15}>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>
                                    {user?.username.substring(0, 2).toUpperCase() || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs truncate w-16">{payload.value}</span>
                              </div>
                            </foreignObject>
                          </g>
                        );
                      }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value} ratings`, "Activity"]}
                      labelFormatter={(value) => {
                        const user = userEngagement?.find(u => u.username === value);
                        return `${value} (Last active: ${user ? format(new Date(user.last_activity), 'MMM d, yyyy') : 'N/A'})`;
                      }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "0.5rem",
                        boxShadow: "0 1px 2px hsla(var(--shadow))",
                      }}
                    />
                    <Bar 
                      dataKey="ratings_count" 
                      fill="hsl(var(--primary))" 
                      radius={[0, 4, 4, 0]}
                      name="Ratings"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent User Registrations */}
            <div>
              <h3 className="text-lg font-medium mb-3">Recent Registrations</h3>
              <div className="space-y-3">
                {userGrowth?.slice(-3).reverse().map((day, index) => (
                  <div key={day.date} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full h-8 w-8 flex items-center justify-center bg-primary/10">
                        <UserPlus className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {day.count} new user{day.count !== 1 ? 's' : ''} joined
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(day.date), 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => router.push('/admin/users')}>
          View All Users
        </Button>
      </CardFooter>
    </Card>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  color: string;
  isDecimal?: boolean;
}

function MetricCard({ title, value, icon, description, color, isDecimal }: MetricCardProps) {
  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">
            {isDecimal ? value.toFixed(1) : value}
          </p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className={`p-2 rounded-full h-fit ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Helper functions to generate placeholder data

function generateUserGrowthData(): UserGrowthData[] {
  const data: UserGrowthData[] = [];
  const today = new Date();
  let userCount = 250; // Starting count
  
  // Generate 30 days of data
  for (let i = 30; i >= 0; i--) {
    const date = subDays(today, i);
    // Add between 0-10 new users each day with some randomness
    const dailyIncrease = Math.floor(Math.random() * 10) + (i < 10 ? 5 : 1);
    userCount += dailyIncrease;
    
    data.push({
      date: date.toISOString().split('T')[0],
      count: userCount
    });
  }
  
  return data;
}

function generateEngagementData(): UserEngagementData[] {
  const users = [
    { user_id: 1, username: "John Doe", ratings_count: 42, last_activity: new Date().toISOString().split('T')[0] },
    { user_id: 2, username: "Jane Smith", ratings_count: 38, last_activity: new Date().toISOString().split('T')[0] },
    { user_id: 3, username: "Robert Johnson", ratings_count: 29, last_activity: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
    { user_id: 4, username: "Emily Williams", ratings_count: 25, last_activity: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0] },
    { user_id: 5, username: "Michael Brown", ratings_count: 21, last_activity: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0] },
    { user_id: 6, username: "Sarah Davis", ratings_count: 18, last_activity: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0] },
    { user_id: 7, username: "David Miller", ratings_count: 15, last_activity: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0] },
  ];
  
  // Sort by rating count in descending order
  return users.sort((a, b) => b.ratings_count - a.ratings_count);
}
