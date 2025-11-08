import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/agent';

/**
 * Purchase API Slice
 * All purchase-related endpoints centralized here
 */
export const PurchaseAPI = createApi({
  reducerPath: 'purchaseSlice',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Purchase'],
  endpoints: (build) => ({
    // Create new purchase
    createPurchase: build.mutation({
      query: (data: { productId: string; productName: string; amount: number }) => ({
        url: '/purchase/create',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Purchase'],
    }),

    // Get purchase history
    getPurchaseHistory: build.query({
      query: ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => ({
        url: `/purchase/history?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['Purchase'],
    }),

    // Get user purchases (admin)
    getUserPurchases: build.query({
      query: ({ userId, page = 1, limit = 10 }: { userId: string; page?: number; limit?: number }) => ({
        url: `/purchase/user/${userId}?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['Purchase'],
    }),
  }),
});

// Export hooks for components to use
export const {
  useCreatePurchaseMutation,
  useGetPurchaseHistoryQuery,
  useLazyGetPurchaseHistoryQuery,
  useGetUserPurchasesQuery,
  useLazyGetUserPurchasesQuery,
} = PurchaseAPI;

// Export reducer for store configuration
export const PurchaseAPIReducer = PurchaseAPI.reducer;
export const purchaseApiMiddleware = PurchaseAPI.middleware;
