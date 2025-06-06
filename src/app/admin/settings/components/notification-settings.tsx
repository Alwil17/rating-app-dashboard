"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function NotificationSettings() {
  const notificationTypes = [
    {
      id: "new-ratings",
      name: "New Ratings",
      description: "When someone rates an item you've added",
      checked: true
    },
    {
      id: "comments",
      name: "Comments",
      description: "When someone comments on your ratings",
      checked: true
    },
    {
      id: "mentions",
      name: "Mentions",
      description: "When someone mentions you in a comment",
      checked: true
    },
    {
      id: "updates",
      name: "System Updates",
      description: "Important updates about the platform",
      checked: false
    },
    {
      id: "newsletter",
      name: "Newsletter",
      description: "Monthly digest of platform activity",
      checked: false
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Configure how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Delivery Methods</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="browser-notifications">Browser notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Show notifications in your browser
                    </p>
                  </div>
                  <Switch id="browser-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-0.5">
                    <Label>Notification frequency</Label>
                    <p className="text-sm text-muted-foreground">
                      How often should we send you notification digests?
                    </p>
                  </div>
                  <Select defaultValue="realtime">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="daily">Daily digest</SelectItem>
                      <SelectItem value="weekly">Weekly digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium">Notification Types</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Select the types of notifications you'd like to receive
              </p>
              <div className="mt-4 space-y-4">
                {notificationTypes.map((type) => (
                  <div key={type.id} className="flex items-start space-x-2">
                    <Checkbox id={type.id} defaultChecked={type.checked} />
                    <div className="grid gap-1.5">
                      <Label htmlFor={type.id} className="font-medium">
                        {type.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline">Cancel</Button>
              <Button>Save preferences</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
