"use client";

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

export function AuthStatus() {
  const [status, setStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  const [tokenExpiry, setTokenExpiry] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setStatus('unauthenticated');
        return;
      }

      try {
        // Parse JWT to get expiry
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        
        const payload = JSON.parse(jsonPayload);
        if (payload.exp) {
          const expiryDate = new Date(payload.exp * 1000);
          setTokenExpiry(expiryDate.toLocaleString());
          
          if (expiryDate > new Date()) {
            setStatus('authenticated');
          } else {
            setStatus('unauthenticated');
          }
        } else {
          setStatus('authenticated'); // No expiry found, assume valid
        }
      } catch (e) {
        console.error('Error parsing token', e);
        setStatus('unauthenticated');
      }
    };

    checkAuth();
    // Re-check every 30 seconds
    const interval = setInterval(checkAuth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV === 'production') return null;

  let badgeText: string;
  if (status === 'checking') {
    badgeText = 'Checking auth...';
  } else if (status === 'authenticated') {
    badgeText = `Authenticated (expires: ${tokenExpiry})`;
  } else {
    badgeText = 'Not authenticated';
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge variant={status === 'authenticated' ? 'default' : 'destructive'}>
        {badgeText}
      </Badge>
    </div>
  );
}
