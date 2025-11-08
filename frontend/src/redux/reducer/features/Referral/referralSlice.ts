import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/agent';

/**
 * Referral API Slice
 * All referral-related endpoints centralized here
 */
export const ReferralAPI = createApi({
  reducerPath: 'referralSlice',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Referral', 'ReferralStats'],
  endpoints: (build) => ({
    // Get referral statistics
    getReferralStats: build.query({
      query: () => ({
        url: '/referral/stats',
        method: 'GET',
      }),
      providesTags: ['ReferralStats'],
    }),

    // Get referral link
    getReferralLink: build.query({
      query: () => ({
        url: '/referral/link',
        method: 'GET',
      }),
      providesTags: ['Referral'],
    }),

    // Validate referral code
    validateReferralCode: build.mutation({
      query: (referralCode: string) => ({
        url: '/referral/validate',
        method: 'POST',
        data: { referralCode },
      }),
    }),

    // Get referral history
    getReferralHistory: build.query({
      query: ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => ({
        url: `/referral/history?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['Referral'],
    }),
  }),
});

// Export hooks for components to use
export const {
  useGetReferralStatsQuery,
  useLazyGetReferralStatsQuery,
  useGetReferralLinkQuery,
  useLazyGetReferralLinkQuery,
  useValidateReferralCodeMutation,
  useGetReferralHistoryQuery,
  useLazyGetReferralHistoryQuery,
} = ReferralAPI;

// Export reducer for store configuration
export const ReferralAPIReducer = ReferralAPI.reducer;
export const referralApiMiddleware = ReferralAPI.middleware;
