"use client";

import { UserResponse } from "@/schema/user.schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";

type ProfileAvatarProps = {
  user: UserResponse | undefined;
};

export function ProfileAvatar({ user }: Readonly<ProfileAvatarProps>) {
  if (!user) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <Avatar className="h-32 w-32">
          <AvatarImage src={user.image_url || undefined} />
          <AvatarFallback className="text-4xl">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="text-center">
          <h3 className="text-2xl font-bold">{user.name}</h3>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        
        <div className="w-full pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Member since</span>
            </div>
            <span>{format(new Date(user.created_at), 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>Last updated</span>
            </div>
            <span>{format(new Date(user.updated_at), 'MMMM d, yyyy')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
