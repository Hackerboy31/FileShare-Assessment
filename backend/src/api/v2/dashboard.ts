import { Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth';
import {
  calculateDashboardStats,
  calculateDashboardMetrics,
  fetchUserActivity
} from '../../helper/v2/dashboardHelper';

/**
 * Get dashboard statistics for current user
 * @route GET /api/v2/dashboard/stats
 * @access Private
 */
export const getDashboardStats = [
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated'
        });
        return;
      }

      const stats = await calculateDashboardStats(req.userId);

      res.status(200).json({
        status: 'success',
        data: stats
      });
    } catch (error: any) {
      next(error);
    }
  }
];

/**
 * Get comprehensive dashboard metrics
 * @route GET /api/v2/dashboard/metrics
 * @access Private
 */
export const getDashboardMetrics = [
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated'
        });
        return;
      }

      const metrics = await calculateDashboardMetrics(req.userId);

      res.status(200).json({
        status: 'success',
        data: metrics
      });
    } catch (error: any) {
      next(error);
    }
  }
];

/**
 * Get user activity log
 * @route GET /api/v2/dashboard/activity
 * @access Private
 */
export const getUserActivity = [
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated'
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const activity = await fetchUserActivity(req.userId, page, limit);

      res.status(200).json({
        status: 'success',
        data: activity
      });
    } catch (error: any) {
      next(error);
    }
  }
];
