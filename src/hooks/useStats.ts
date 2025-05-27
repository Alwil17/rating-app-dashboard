import api from '@/utils/axios';
import { useState, useEffect } from 'react';

interface DashboardStats {
  totalUsers: number;
  totalRatings: number;
  recentActivity: number;
  isLoading: boolean;
  error: string | null;
}

export const useStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRatings: 0,
    recentActivity: 0,
    isLoading: true,
    error: null,
  });

  const fetchStats = async () => {
    try {
      const [usersResponse, ratingsResponse] = await Promise.all([
        api.get('/users'),
        api.get('/ratings'),
      ]);

      const last24h = new Date();
      last24h.setHours(last24h.getHours() - 24);
      
      const recentRatings = ratingsResponse.data.filter(
        (rating: { created_at: string }) => new Date(rating.created_at) > last24h
      );

      setStats({
        totalUsers: usersResponse.data.length,
        totalRatings: ratingsResponse.data.length,
        recentActivity: recentRatings.length,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Stats fetch error:', error);
      setStats(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch statistics',
      }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return stats;
};
