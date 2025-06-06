"use client";

import { useBreadcrumb } from "@/contexts/breadcrumb.context";
import { useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useProfile } from "@/hooks/queries/use-profile.query";
import { Loader2, User } from "lucide-react";
import { ProfileForm } from "./components/profile-form";
import { ProfileAvatar } from "./components/profile-avatar";
import { DeleteAccount } from "./components/delete-account";

export default function ProfilePage() {
  const { setPageTitle } = useBreadcrumb();
  const { data: user, isLoading, error } = useProfile();
  
  useEffect(() => {
    setPageTitle('My Profile');
  }, [setPageTitle]);
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-destructive">Error loading profile</p>
        <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
      </div>
    );
  }
  
  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="View and manage your personal information"
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="container mx-auto py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <ProfileAvatar user={user} />
            </div>
            
            <div className="md:col-span-2 space-y-8">
              <ProfileForm user={user} isLoading={isLoading} />
              
              <DeleteAccount />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
