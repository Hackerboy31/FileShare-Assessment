import { Router } from 'express';
import { API_URL_PREFIX } from './index';

// Import all endpoint handlers
import {
  register,
  login,
  logout,
  getCurrentUser,
  refreshToken
} from './auth';

import {
  getReferralStats,
  getReferralLink,
  validateReferralCode,
  getReferralHistory
} from './referral';

import {
  createPurchase,
  getPurchaseHistory,
  getUserPurchases
} from './purchase';

import {
  getDashboardStats,
  getDashboardMetrics,
  getUserActivity
} from './dashboard';

/**
 * Central route registration for all API v2 endpoints
 * Following the clean architecture pattern from API_ROUTING_ARCHITECTURE.md
 * 
 * All routes are organized by functional groups for easy maintenance
 */
export function initializeRoutes(router: Router): void {
  // =============================================================================
  // AUTHENTICATION ENDPOINTS
  // =============================================================================
  // User registration, login, and token management
  
  router.post(`${API_URL_PREFIX}/auth/register`, register);
  router.post(`${API_URL_PREFIX}/auth/login`, login);
  router.post(`${API_URL_PREFIX}/auth/logout`, logout);
  router.get(`${API_URL_PREFIX}/auth/me`, getCurrentUser);
  router.post(`${API_URL_PREFIX}/auth/refresh`, refreshToken);

  // =============================================================================
  // REFERRAL MANAGEMENT ENDPOINTS
  // =============================================================================
  // Referral tracking, validation, and statistics
  
  router.get(`${API_URL_PREFIX}/referral/stats`, getReferralStats);
  router.get(`${API_URL_PREFIX}/referral/link`, getReferralLink);
  router.post(`${API_URL_PREFIX}/referral/validate`, validateReferralCode);
  router.get(`${API_URL_PREFIX}/referral/history`, getReferralHistory);

  // =============================================================================
  // PURCHASE MANAGEMENT ENDPOINTS
  // =============================================================================
  // Purchase simulation, tracking, and credit processing
  
  router.post(`${API_URL_PREFIX}/purchase/create`, createPurchase);
  router.get(`${API_URL_PREFIX}/purchase/history`, getPurchaseHistory);
  router.get(`${API_URL_PREFIX}/purchase/user/:userId`, getUserPurchases);

  // =============================================================================
  // DASHBOARD & ANALYTICS ENDPOINTS
  // =============================================================================
  // User dashboard metrics, statistics, and activity tracking
  
  router.get(`${API_URL_PREFIX}/dashboard/stats`, getDashboardStats);
  router.get(`${API_URL_PREFIX}/dashboard/metrics`, getDashboardMetrics);
  router.get(`${API_URL_PREFIX}/dashboard/activity`, getUserActivity);

  console.log('✅ All API v2 routes initialized successfully');
}
