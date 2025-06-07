"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader2 } from "lucide-react";

interface TopItemsChartProps {
  data: Array<{ item: string; users: number }>;
  isLoading: boolean;
}

export function TopItemsChart({ data, isLoading }: Readonly<TopItemsChartProps>) {
  // Filter out items with zero ratings and ensure we have data
  const filteredData = data.filter(item => item.users > 0);

  const cardDescription =
    filteredData.length < data.length
      ? `Showing ${filteredData.length} items with ratings`
      : "Most popular items";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Items by User Rating</CardTitle>
        <CardDescription>
          {cardDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {(() => {
          if (isLoading) {
            return (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            );
          }
          if (filteredData.length === 0) {
            return (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No rated items available
              </div>
            );
          }
          return (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
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
          );
        })()}
      </CardContent>
    </Card>
  );
}
