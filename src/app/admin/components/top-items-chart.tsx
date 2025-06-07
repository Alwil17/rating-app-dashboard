"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TopItemsChartProps {
  data: Array<{ item: string; users: number }>;
  isLoading: boolean;
}

export function TopItemsChart({ data, isLoading }: Readonly<TopItemsChartProps>) {
  const { t } = useTranslation();
  
  // Filter out items with zero ratings and ensure we have data
  const filteredData = data.filter(item => item.users > 0);

  const cardDescription =
    filteredData.length < data.length
      ? t('dashboard.charts.topItems.showingCount', { count: filteredData.length })
      : t('dashboard.charts.topItems.subtitle');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.charts.topItems.title')}</CardTitle>
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
                {t('dashboard.charts.topItems.noData')}
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
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis 
                  type="number" 
                  stroke="var(--muted-foreground)" 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  dataKey="item" 
                  type="category" 
                  width={100}
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  formatter={(value) => [value, t('dashboard.charts.topItems.users')]}
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                    borderRadius: "0.5rem",
                    boxShadow: "0 1px 2px hsla(var(--shadow))",
                  }}
                />
                <Bar 
                  dataKey="users" 
                  fill="var(--primary)" 
                  radius={[0, 4, 4, 0]}
                  name={t('dashboard.charts.topItems.users')}
                />
              </BarChart>
            </ResponsiveContainer>
          );
        })()}
      </CardContent>
    </Card>
  );
}
