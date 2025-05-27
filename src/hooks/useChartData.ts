import { useState, useEffect } from 'react';
import api from '@/utils/axios';

interface ChartData {
  ratingsOverTime: {
    dates: string[];
    values: number[];
  };
  usersByItem: {
    items: string[];
    counts: number[];
  };
  ratingsByCategory: {
    categories: string[];
    counts: number[];
  };
  isLoading: boolean;
  error: string | null;
}

export const useChartData = () => {
  const [data, setData] = useState<ChartData>({
    ratingsOverTime: { dates: [], values: [] },
    usersByItem: { items: [], counts: [] },
    ratingsByCategory: { categories: [], counts: [] },
    isLoading: true,
    error: null,
  });

  const fetchChartData = async () => {
    try {
      const [ratingsRes, itemsRes, categoriesRes] = await Promise.all([
        api.get('/ratings'),
        api.get('/items'),
        api.get('/categories'),
      ]);

      // Process ratings over time
      const ratingsByDate = groupRatingsByDate(ratingsRes.data);
      
      // Process users by item
      const itemStats = calculateItemStats(itemsRes.data);
      
      // Process ratings by category
      const categoryStats = calculateCategoryStats(categoriesRes.data, itemsRes.data);

      setData({
        ratingsOverTime: {
          dates: Object.keys(ratingsByDate),
          values: Object.values(ratingsByDate),
        },
        usersByItem: {
          items: itemStats.map(i => i.name),
          counts: itemStats.map(i => i.userCount),
        },
        ratingsByCategory: {
          categories: categoryStats.map(c => c.name),
          counts: categoryStats.map(c => c.count),
        },
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch chart data',
      }));
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  return data;
};

// Helper functions
const groupRatingsByDate = (ratings: any[]) => {
  const grouped = ratings.reduce((acc: any, rating: any) => {
    const date = new Date(rating.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  return grouped;
};

const calculateItemStats = (items: any[]) => {
  return items.map(item => ({
    name: item.name,
    userCount: item.count_rating || 0,
  }));
};

const calculateCategoryStats = (categories: any[], items: any[]) => {
  return categories.map(category => ({
    name: category.name,
    count: items.filter(item => 
      item.categories.some((cat: any) => cat.id === category.id)
    ).length
  }));
};
