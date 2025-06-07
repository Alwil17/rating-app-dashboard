"use client";

import { useBreadcrumb } from "@/contexts/breadcrumb.context";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useProfile } from "@/hooks/queries/use-profile.query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { AppearanceSettings } from "./components/appearance-settings";
import { NotificationSettings } from "./components/notification-settings";
import { APISettings } from "./components/api-settings";

export default function SettingsPage() {
  const { setPageTitle } = useBreadcrumb();
  const { data: user, isLoading, error } = useProfile();
  const [activeTab, setActiveTab] = useState("appearance");

  useEffect(() => {
    setPageTitle('Settings');
  }, [setPageTitle]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-destructive">Error loading settings</p>
        <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage your account settings and preferences"
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="container mx-auto py-10">
          <Tabs defaultValue="appearance" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="api">API Access</TabsTrigger>
            </TabsList>
            <TabsContent value="appearance">
              <AppearanceSettings />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>
            <TabsContent value="api">
              <APISettings />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
