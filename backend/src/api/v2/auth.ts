import { Request, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth';
import {
  registerUser,
  loginUser,
  getUserProfile,
  generateToken
} from '../../helper/v2/authHelper';

/**
 * Register a new user
 * @route POST /api/v2/auth/register
 * @access Public
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, referralCode } = req.body;

    // Validate input
    if (!name || !email || !password) {
      res.status(400).json({
        status: 'error',
        message: 'Please provide name, email, and password'
      });
      return;
    }

    // Register user with helper
    const result = await registerUser({ name, email, password, referralCode });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: result
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Login user
 * @route POST /api/v2/auth/login
 * @access Public
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
      return;
    }

    // Login user with helper
    const result = await loginUser({ email, password });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: result
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Logout user (client-side token removal)
 * @route POST /api/v2/auth/logout
 * @access Private
 */
export const logout = [
  authenticate,
  async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // In a stateless JWT system, logout is handled client-side
      // You can implement token blacklisting here if needed
      res.status(200).json({
        status: 'success',
        message: 'Logout successful'
      });
    } catch (error: any) {
      next(error);
    }
  }
];

/**
 * Get current user profile
 * @route GET /api/v2/auth/me
 * @access Private
 */
export const getCurrentUser = [
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

      const user = await getUserProfile(req.userId);

      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error: any) {
      next(error);
    }
  }
];

/**
 * Refresh JWT token
 * @route POST /api/v2/auth/refresh
 * @access Private
 */
export const refreshToken = [
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

      const newToken = generateToken(req.userId);

      res.status(200).json({
        status: 'success',
        message: 'Token refreshed successfully',
        data: { token: newToken }
      });
    } catch (error: any) {
      next(error);
    }
  }
];
