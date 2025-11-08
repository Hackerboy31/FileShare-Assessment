import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

/**
 * Central API Configuration
 * Following the pattern from API_ARCHITECTURE_FRONTEND.md
 * 
 * This file serves as the central hub for all API configurations:
 * - Axios instances for different services
 * - BaseQuery functions for RTK Query integration
 * - Authentication handling via interceptors
 * - Error handling and response processing
 */

// =============================================================================
// BASE URLs FOR DIFFERENT ENVIRONMENTS
// =============================================================================

export const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v2';
export const apiBaseURL = `${baseURL}/api/${apiVersion}`;

console.log('🔗 API Configuration:', {
  baseURL,
  apiVersion,
  fullURL: apiBaseURL
});

// =============================================================================
// AXIOS INSTANCE CONFIGURATION
// =============================================================================

/**
 * Main Axios instance for API calls
 * Includes automatic token injection and error handling
 */
export const axiosInstance = axios.create({
  baseURL: apiBaseURL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =============================================================================
// REQUEST INTERCEPTOR - ADD AUTH TOKEN
// =============================================================================

axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timezone header
    config.headers['X-Timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =============================================================================
// RESPONSE INTERCEPTOR - HANDLE ERRORS
// =============================================================================

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// =============================================================================
// GENERIC REQUEST METHODS
// =============================================================================

const responseBody = <T>(response: any): T => response.data;

export const requests = {
  get: <T>(url: string) => axiosInstance.get<T>(url).then(responseBody),
  post: <T>(url: string, body: object) => axiosInstance.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: object) => axiosInstance.put<T>(url, body).then(responseBody),
  patch: <T>(url: string, body: object) => axiosInstance.patch<T>(url, body).then(responseBody),
  del: <T>(url: string) => axiosInstance.delete<T>(url).then(responseBody),
};

// =============================================================================
// RTK QUERY BASE QUERY FUNCTION
// =============================================================================

interface BaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
}

/**
 * Custom baseQuery for RTK Query using Axios
 * Automatically adds auth token from Redux store
 * Handles errors consistently across all API calls
 */
export const axiosBaseQuery = (
  { baseUrl }: { baseUrl?: string } = { baseUrl: apiBaseURL }
): BaseQueryFn<BaseQueryArgs, unknown, unknown> => {
  return async ({ url, method = 'GET', data, params, headers }) => {
    try {
      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          'X-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        timeout: 100000,
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
};

// =============================================================================
// API ENDPOINTS HELPERS (Optional - for direct axios calls)
// =============================================================================

export const AuthAPI = {
  register: (data: { name: string; email: string; password: string; referralCode?: string }) =>
    requests.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    requests.post('/auth/login', data),
  logout: () =>
    requests.post('/auth/logout', {}),
  getCurrentUser: () =>
    requests.get('/auth/me'),
  refreshToken: () =>
    requests.post('/auth/refresh', {}),
};

export const ReferralAPI = {
  getStats: () =>
    requests.get('/referral/stats'),
  getLink: () =>
    requests.get('/referral/link'),
  validate: (referralCode: string) =>
    requests.post('/referral/validate', { referralCode }),
  getHistory: (page: number = 1, limit: number = 10) =>
    requests.get(`/referral/history?page=${page}&limit=${limit}`),
};

export const PurchaseAPI = {
  create: (data: { productId: string; productName: string; amount: number }) =>
    requests.post('/purchase/create', data),
  getHistory: (page: number = 1, limit: number = 10) =>
    requests.get(`/purchase/history?page=${page}&limit=${limit}`),
  getUserPurchases: (userId: string, page: number = 1, limit: number = 10) =>
    requests.get(`/purchase/user/${userId}?page=${page}&limit=${limit}`),
};

export const DashboardAPI = {
  getStats: () =>
    requests.get('/dashboard/stats'),
  getMetrics: () =>
    requests.get('/dashboard/metrics'),
  getActivity: (page: number = 1, limit: number = 10) =>
    requests.get(`/dashboard/activity?page=${page}&limit=${limit}`),
};

/**
 * Helper to set authentication token
 * Call this after successful login
 */
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

/**
 * Helper to clear authentication
 * Call this on logout
 */
export const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
