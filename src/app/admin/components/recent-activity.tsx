"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface ActivityItem {
  type: 'rating' | 'user';
  title: string;
  description: string;
  timeAgo: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

export function RecentActivity({ activities }: Readonly<RecentActivityProps>) {
  const router = useRouter();
  
  // Default activities if none provided
  const defaultActivities: ActivityItem[] = [
    {
      type: 'rating',
      title: 'New rating added',
      description: 'User rated Item #12 with 4.5 stars',
      timeAgo: '2 hours ago',
    },
    {
      type: 'user',
      title: 'New user registered',
      description: 'John Doe joined the platform',
      timeAgo: '5 hours ago',
    },
  ];

  const items = activities || defaultActivities;

  return (
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
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="rounded-full h-8 w-8 flex items-center justify-center bg-primary/10">
                {item.type === 'rating' ? (
                  <Star className="h-4 w-4 text-primary" />
                ) : (
                  <Users className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                <p className="text-xs text-muted-foreground">{item.timeAgo}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
