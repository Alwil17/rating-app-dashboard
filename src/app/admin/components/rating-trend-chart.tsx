"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface RatingTrendChartProps {
  data: Array<{ month: string; ratings: number }>;
  isLoading: boolean;
}

export function RatingTrendChart({ data, isLoading }: Readonly<RatingTrendChartProps>) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.charts.ratingTrend.title')}</CardTitle>
        <CardDescription>{t('dashboard.charts.ratingTrend.subtitle')}</CardDescription>
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
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis 
                dataKey="month" 
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return format(date, 'MMM d');
                }}
                stroke="var(--muted-foreground)"
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="var(--muted-foreground)" 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                  borderRadius: "0.5rem",
                  boxShadow: "0 1px 2px hsla(var(--shadow))",
                }}
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return format(date, 'MMMM d, yyyy');
                }}
                formatter={(value) => [
                  value, 
                  t('dashboard.charts.ratingTrend.ratings')
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="ratings" 
                stroke="var(--primary)" 
                fillOpacity={1} 
                fill="url(#colorRatings)" 
                name={t('dashboard.charts.ratingTrend.ratings')} 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
