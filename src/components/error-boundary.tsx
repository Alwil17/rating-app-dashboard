"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: Readonly<ErrorBoundaryProps>) {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Caught error:", event.error);
      setHasError(true);
      
      // Prevent the error from bubbling up
      event.preventDefault();
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="text-muted-foreground">
            We're sorry, but there was an error loading this page.
          </p>
          <Button onClick={() => {
            setHasError(false);
            window.location.href = '/';
          }}>
            Go to home page
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
