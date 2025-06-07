"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Script from "next/script";
import { GA_MEASUREMENT_ID, APP_VERSION, ENABLE_ANALYTICS } from "@/config/env";
import { useAuth } from "@/contexts/auth.context";

export function Analytics() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Track page views when route changes
  useEffect(() => {
    if (ENABLE_ANALYTICS && window.gtag && pathname) {
      // Track admin-specific metrics
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: pathname,
        app_version: APP_VERSION,
        admin_role: user?.role ?? 'unknown',
        dashboard_section: pathname.split('/')[2] || 'main',
      });
    }
  }, [pathname, user?.role]);

  // Don't load scripts if analytics are disabled
  if (!ENABLE_ANALYTICS || !GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              app_version: '${APP_VERSION}'
            });
          `,
        }}
      />
    </>
  );
}

// Extend Window type to include gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}
