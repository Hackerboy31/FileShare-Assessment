import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/agent';

/**
 * Authentication API Slice
 * Following the pattern from API_ARCHITECTURE_FRONTEND.md
 * 
 * All authentication-related endpoints are centralized here
 */
export const AuthAPI = createApi({
  reducerPath: 'authSlice',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['User'],
  endpoints: (build) => ({
    // Register new user
    register: build.mutation({
      query: (data: { name: string; email: string; password: string; referralCode?: string }) => ({
        url: '/auth/register',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['User'],
    }),

    // Login user
    login: build.mutation({
      query: (data: { email: string; password: string }) => ({
        url: '/auth/login',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['User'],
    }),

    // Logout user
    logout: build.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    // Get current user
    getCurrentUser: build.query({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    // Refresh token
    refreshToken: build.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),
  }),
});

// Export hooks for components to use
export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useRefreshTokenMutation,
} = AuthAPI;

// Export reducer for store configuration
export const AuthAPIReducer = AuthAPI.reducer;
export const authApiMiddleware = AuthAPI.middleware;
