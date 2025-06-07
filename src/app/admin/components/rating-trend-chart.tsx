"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface RatingTrendChartProps {
  data: Array<{ month: string; ratings: number }>;
  isLoading: boolean;
}

export function RatingTrendChart({ data, isLoading }: RatingTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ratings Over Time</CardTitle>
        <CardDescription>Daily rating trends</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
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
  );
}
