import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/agent';

/**
 * Dashboard API Slice
 * All dashboard and analytics endpoints centralized here
 */
export const DashboardAPI = createApi({
  reducerPath: 'dashboardSlice',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Dashboard', 'Stats', 'Metrics', 'Activity'],
  endpoints: (build) => ({
    // Get dashboard statistics
    getDashboardStats: build.query({
      query: () => ({
        url: '/dashboard/stats',
        method: 'GET',
      }),
      providesTags: ['Stats'],
    }),

    // Get dashboard metrics
    getDashboardMetrics: build.query({
      query: () => ({
        url: '/dashboard/metrics',
        method: 'GET',
      }),
      providesTags: ['Metrics'],
    }),

    // Get user activity
    getUserActivity: build.query({
      query: ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => ({
        url: `/dashboard/activity?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['Activity'],
    }),
  }),
});

// Export hooks for components to use
export const {
  useGetDashboardStatsQuery,
  useLazyGetDashboardStatsQuery,
  useGetDashboardMetricsQuery,
  useLazyGetDashboardMetricsQuery,
  useGetUserActivityQuery,
  useLazyGetUserActivityQuery,
} = DashboardAPI;

// Export reducer for store configuration
export const DashboardAPIReducer = DashboardAPI.reducer;
export const dashboardApiMiddleware = DashboardAPI.middleware;
