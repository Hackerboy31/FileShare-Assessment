import { Request, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth';
import {
  getUserReferralStats,
  getUserReferralLink,
  checkReferralCode,
  fetchReferralHistory
} from '../../helper/v2/referralHelper';

/**
 * Get referral statistics for current user
 * @route GET /api/v2/referral/stats
 * @access Private
 */
export const getReferralStats = [
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

      const stats = await getUserReferralStats(req.userId);

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
 * Get user's unique referral link
 * @route GET /api/v2/referral/link
 * @access Private
 */
export const getReferralLink = [
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

      const linkData = await getUserReferralLink(req.userId);

      res.status(200).json({
        status: 'success',
        data: linkData
      });
    } catch (error: any) {
      next(error);
    }
  }
];

/**
 * Validate a referral code
 * @route POST /api/v2/referral/validate
 * @access Public
 */
export const validateReferralCode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { referralCode } = req.body;

    if (!referralCode) {
      res.status(400).json({
        status: 'error',
        message: 'Referral code is required'
      });
      return;
    }

    const validationResult = await checkReferralCode(referralCode);

    res.status(200).json({
      status: 'success',
      data: validationResult
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Get referral history for current user
 * @route GET /api/v2/referral/history
 * @access Private
 */
export const getReferralHistory = [
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

      const history = await fetchReferralHistory(req.userId, page, limit);

      res.status(200).json({
        status: 'success',
        data: history
      });
    } catch (error: any) {
      next(error);
    }
  }
];
