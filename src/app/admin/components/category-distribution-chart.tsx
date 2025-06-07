"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryChartProps {
  data: Array<{ name: string; value: number }>;
  isLoading: boolean;
}

export function CategoryDistributionChart({ data, isLoading }: Readonly<CategoryChartProps>) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
  
  // Filter out categories with zero values and limit to top 7 categories if there are too many
  const filteredData = data
    .filter(category => category.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);
    
  // Calculate total for percentages
  const totalValue = filteredData.reduce((sum, category) => sum + category.value, 0);
  
  // If there are no rated categories
  if (filteredData.length === 0 && !isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Ratings by Category</CardTitle>
          <CardDescription>Distribution across categories</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          No rated categories available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Ratings by Category</CardTitle>
        <CardDescription>
          {filteredData.length < data.length 
            ? `Showing top ${filteredData.length} categories with ratings`
            : "Distribution across categories"}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row h-full">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={filteredData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => {
                      // Only show label for segments that take up enough space
                      return percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : '';
                    }}
                  >
                    {filteredData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} (${((value as number / totalValue) * 100).toFixed(1)}%)`, name]}
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
            <div className="flex-1">
              <ScrollArea className="h-[250px] pr-3">
                <div className="space-y-3 pt-1">
                  {filteredData.map((category, index) => (
                    <div key={category.name} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                          />
                          <span className="text-sm font-medium truncate max-w-[150px]" title={category.name}>
                            {category.name}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {category.value} ({((category.value / totalValue) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <Progress 
                        value={(category.value / totalValue) * 100} 
                        className="h-2"
                        style={{ ['--progress-indicator-color' as any]: COLORS[index % COLORS.length] }}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
