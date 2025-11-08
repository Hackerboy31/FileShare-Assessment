import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  AuthAPI,
  AuthAPIReducer,
  authApiMiddleware,
} from '../reducer/features/Auth/authSlice';
import {
  ReferralAPI,
  ReferralAPIReducer,
  referralApiMiddleware,
} from '../reducer/features/Referral/referralSlice';
import {
  PurchaseAPI,
  PurchaseAPIReducer,
  purchaseApiMiddleware,
} from '../reducer/features/Purchase/purchaseSlice';
import {
  DashboardAPI,
  DashboardAPIReducer,
  dashboardApiMiddleware,
} from '../reducer/features/Dashboard/dashboardSlice';

/**
 * Redux Store Configuration
 * Following the pattern from API_ARCHITECTURE_FRONTEND.md
 * 
 * This store combines all API reducers and handles middleware
 * for RTK Query automatic caching and refetching
 */
export const store = configureStore({
  reducer: {
    // API reducers - RTK Query slices
    [AuthAPI.reducerPath]: AuthAPIReducer,
    [ReferralAPI.reducerPath]: ReferralAPIReducer,
    [PurchaseAPI.reducerPath]: PurchaseAPIReducer,
    [DashboardAPI.reducerPath]: DashboardAPIReducer,
  },
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state for serialization checks
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(
      authApiMiddleware,
      referralApiMiddleware,
      purchaseApiMiddleware,
      dashboardApiMiddleware
    ),
  
  devTools: process.env.NODE_ENV !== 'production',
});

// Enable refetchOnFocus and refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Infer types from store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
