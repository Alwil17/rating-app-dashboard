"use client";

import { ErrorBoundary } from "@/components/error-boundary";
import { AuthStatus } from "@/components/auth-status";
import { LoadingPage } from "@/components/loading-page";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import AdminHeader from "./components/admin-header";
import { BreadcrumbProvider } from "@/contexts/breadcrumb.context";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // First, guarantee we're client-side before attempting authentication
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingPage />;
  }

  // Only after confirming we're client-side, check for the token
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Redirect if no token found
  if (!token) {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
    return <LoadingPage />;
  }

  return (
      <SidebarProvider>
      <BreadcrumbProvider>
        <AppSidebar />
        <SidebarInset className="overflow-hidden px-4 md:px-6 lg:px-8">
          <AdminHeader />
            <ErrorBoundary>
              <div className="flex-1 px-4 md:px-6 pt-2 pb-8">{children}</div>
            </ErrorBoundary>
            <AuthStatus />
        </SidebarInset>
      </BreadcrumbProvider>
    </SidebarProvider>
  );
}