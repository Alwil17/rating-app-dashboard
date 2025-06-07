"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

export function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Start loading animation
    const startLoading = () => {
      setIsLoading(true);
      setProgress(0);
      
      // Simulate progress steps
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 90) {
            // Stop at 90% until actually loaded
            return 90;
          }
          return prevProgress + 10;
        });
      }, 100);
    };

    // Complete loading animation
    const completeLoading = () => {
      clearInterval(interval);
      setProgress(100);
      
      // Reset after animation completes
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 300);
    };

    startLoading();

    // Clean up and finish animation on successful navigation
    return () => {
      clearInterval(interval);
      completeLoading();
    };
  }, [pathname, searchParams]);

  if (!isLoading && progress === 0) return null;

  return (
    <Progress
      value={progress}
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary transition-all ease-in-out duration-300"
    />
  );
}
