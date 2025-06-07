"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowUpRight, LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  link: string;
  isLoading: boolean;
  error: string | null;
}

export function StatCard({ 
  label, value, icon: Icon, color, bgColor, link, isLoading, error 
}: Readonly<StatCardProps>) {
  const router = useRouter();
  
  return (
    <Card 
      className="hover:shadow-md transition-all duration-200 group cursor-pointer overflow-hidden relative"
      onClick={() => router.push(link)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="pb-2">
        
        <CardTitle className="flex items-center justify-start gap-2 group-hover:text-primary transition-colors duration-200">
          <div className={`p-2 rounded-full w-fit ${bgColor} ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
          <span>{label}</span>
          <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
        </CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                value
              )}
            </span>
          </div>
          {error && <p className="text-sm text-destructive mt-1">{error}</p>}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

interface StatsCardsProps {
  stats: Array<{
    label: string;
    value: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    link: string;
  }>;
  isLoading: boolean;
  error: string | null;
}

export function StatsCards({ stats, isLoading, error }: Readonly<StatsCardsProps>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          {...stat}
          isLoading={isLoading}
          error={error}
        />
      ))}
    </div>
  );
}
