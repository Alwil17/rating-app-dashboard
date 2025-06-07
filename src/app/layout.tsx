'use client';

import { ThemeProvider } from "@/components/theme-provider";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/auth.context';
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import { ErrorBoundary } from '@/components/error-boundary';
import { Analytics } from "@/components/analytics";
import { RouteProgressBar } from "@/components/route-progress-bar";
import { useEffect } from "react";
import "@/i18n/config";  // Import i18n configuration

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Prevent SSR/client mismatch with next-themes
  useEffect(() => {
    document.body.classList.remove('no-js');
  }, []);
  
  return (
    <html lang="en" suppressHydrationWarning className="no-js">
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <ErrorBoundary>
                <RouteProgressBar />
                {children}
              </ErrorBoundary>
              <Analytics />
              <Toaster position="top-right" />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}