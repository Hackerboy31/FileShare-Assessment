import { Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth';
import {
  processPurchase,
  fetchPurchaseHistory,
  fetchUserPurchases
} from '../../helper/v2/purchaseHelper';

/**
 * Create a new purchase and process referral credits
 * @route POST /api/v2/purchase/create
 * @access Private
 */
export const createPurchase = [
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

      const { productId, productName, amount } = req.body;

      if (!productId || !productName || !amount) {
        res.status(400).json({
          status: 'error',
          message: 'Please provide productId, productName, and amount'
        });
        return;
      }

      const result = await processPurchase({
        userId: req.userId,
        productId,
        productName,
        amount: parseFloat(amount)
      });

      res.status(201).json({
        status: 'success',
        message: 'Purchase processed successfully',
        data: result
      });
    } catch (error: any) {
      next(error);
    }
  }
];

/**
 * Get purchase history for current user
 * @route GET /api/v2/purchase/history
 * @access Private
 */
export const getPurchaseHistory = [
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

      const history = await fetchPurchaseHistory(req.userId, page, limit);

      res.status(200).json({
        status: 'success',
        data: history
      });
    } catch (error: any) {
      next(error);
    }
  }
];

/**
 * Get purchases for a specific user (admin)
 * @route GET /api/v2/purchase/user/:userId
 * @access Private
 */
export const getUserPurchases = [
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({
          status: 'error',
          message: 'User ID is required'
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const purchases = await fetchUserPurchases(userId, page, limit);

      res.status(200).json({
        status: 'success',
        data: purchases
      });
    } catch (error: any) {
      next(error);
    }
  }
];
