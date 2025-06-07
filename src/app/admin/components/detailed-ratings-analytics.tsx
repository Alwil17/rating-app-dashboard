"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import api from "@/utils/axios";
import { format } from "date-fns";

interface RatingDistribution {
  value: number;
  count: number;
}

interface RecentRating {
  id: number;
  value: number;
  item_name: string;
  user_name: string;
  user_image?: string;
  created_at: string;
}

interface RatingStats {
  average: number;
  totalCount: number;
  topCategory: {
    name: string;
    count: number;
  };
}

export function DetailedRatingsAnalytics() {
  const router = useRouter();
  const { t } = useTranslation();
  
  // Fetch rating distribution data
  const { data: distribution, isLoading: distributionLoading } = useQuery({
    queryKey: ['rating-distribution'],
    queryFn: async () => {
      const response = await api.get<RatingDistribution[]>('/ratings/distribution');
      return response.data;
    },
    // Fallback data in case the endpoint isn't available yet
    placeholderData: [5, 4, 3, 2, 1].map(value => ({ 
      value, 
      count: Math.floor(Math.random() * 100) 
    }))
    // Removed the enabled: false flag to allow real API calls
  });

  // Fetch recent ratings data
  const { data: recentRatings, isLoading: ratingsLoading } = useQuery({
    queryKey: ['recent-ratings'],
    queryFn: async () => {
      const response = await api.get<RecentRating[]>('/ratings/recent');
      return response.data;
    },
    // Fallback data in case the endpoint isn't available yet
    placeholderData: [
      {
        id: 1,
        value: 5,
        item_name: "Product A",
        user_name: "John Doe",
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        value: 4,
        item_name: "Service B",
        user_name: "Jane Smith",
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 3,
        value: 3,
        item_name: "Product C",
        user_name: "Alex Johnson",
        created_at: new Date(Date.now() - 7200000).toISOString()
      }
    ]
    // Removed the enabled: false flag to allow real API calls
  });

  // Fetch overall stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['rating-stats'],
    queryFn: async () => {
      const response = await api.get<RatingStats>('/ratings/stats');
      return response.data;
    },
    // Fallback data in case the endpoint isn't available yet
    placeholderData: {
      average: 4.3,
      totalCount: 328,
      topCategory: {
        name: "Electronics",
        count: 87
      }
    }
    // Removed the enabled: false flag to allow real API calls
  });

  const isLoading = distributionLoading || ratingsLoading || statsLoading;

  // Calculate the total number of ratings for percentage calculations
  const totalRatings = distribution?.reduce((sum, item) => sum + item.count, 0) ?? 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.charts.detailedRatings.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            {/* Rating Distribution */}
            <div>
              <h3 className="text-lg font-medium mb-3">{t('dashboard.charts.detailedRatings.distribution.title')}</h3>
              <div className="grid grid-cols-5 gap-2">
                {distribution?.map((item) => {
                  const percentage = (item.count / totalRatings) * 100;
                  let starColorClass = '';
                  if (item.value >= 4) {
                    starColorClass = 'text-yellow-500 fill-yellow-500';
                  } else if (item.value === 3) {
                    starColorClass = 'text-yellow-400 fill-yellow-400';
                  } else {
                    starColorClass = 'text-red-400 fill-red-400';
                  }
                  
                  return (
                    <div key={item.value} className="flex flex-col items-center">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className={`h-4 w-4 ${starColorClass}`} />
                        <span>{item.value}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mb-1">
                        {(() => {
                          let barColorClass = '';
                          if (item.value >= 4) {
                            barColorClass = 'bg-green-500';
                          } else if (item.value === 3) {
                            barColorClass = 'bg-yellow-500';
                          } else {
                            barColorClass = 'bg-red-500';
                          }
                          return (
                            <div
                              className={`h-2 rounded-full ${barColorClass}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          );
                        })()}
                      </div>
                      <span className="text-xs text-muted-foreground">{item.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Recent Rating Activity */}
            <div>
              <h3 className="text-lg font-medium mb-3">{t('dashboard.charts.detailedRatings.recentActivity.title')}</h3>
              <div className="space-y-3">
                {recentRatings?.map((rating) => (
                  <div key={rating.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        {rating.user_image ? (
                          <AvatarImage src={rating.user_image} />
                        ) : null}
                        <AvatarFallback>{rating.user_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{rating.user_name}</p>
                        <p className="text-xs text-muted-foreground">{rating.item_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {Array(5).fill(0).map((_, index) => (
                        <Star 
                          key={index} 
                          className={`h-3 w-3 ${
                            index < rating.value ? 'fill-yellow-400 text-yellow-400' : 'text-muted'
                          }`} 
                        />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {formatTimeAgo(new Date(rating.created_at))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Rating Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">{t('dashboard.charts.detailedRatings.insights.averageRating')}</h4>
                <div className="flex items-center">
                  <div className="text-2xl font-bold mr-2">{stats?.average.toFixed(1)}</div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => {
                      const fullStar = Math.floor(stats?.average ?? 0);
                      const hasHalfStar = stats?.average && (stats.average % 1) >= 0.5;
                      let starClass = '';
                      if (i <= fullStar) {
                        starClass = 'fill-yellow-400 text-yellow-400';
                      } else if (i === fullStar + 1 && hasHalfStar) {
                        starClass = 'fill-yellow-400/50 text-yellow-400';
                      } else {
                        starClass = 'text-yellow-400/30';
                      }
                      return (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${starClass}`}
                        />
                      );
                    })}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('dashboard.charts.detailedRatings.insights.basedOn', { count: stats?.totalCount })}
                </p>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">{t('dashboard.charts.detailedRatings.insights.topCategory')}</h4>
                <div className="text-lg font-semibold">
                  {stats?.topCategory?.name ?? t('common.noData')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.topCategory
                    ? t('dashboard.charts.detailedRatings.insights.withCount', { count: stats.topCategory.count })
                    : t('dashboard.charts.detailedRatings.insights.noRatings')
                  }
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => router.push('/admin/ratings')}>
          {t('dashboard.charts.detailedRatings.viewAll')}
        </Button>
      </CardFooter>
    </Card>
  );
}

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    return format(date, 'MMM d');
  }
}
