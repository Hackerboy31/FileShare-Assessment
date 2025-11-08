import { User } from '../../models/User';
import { Referral } from '../../models/Referral';
import { AppError } from '../../middleware/errorHandler';

/**
 * Get referral statistics for a user
 */
export const getUserReferralStats = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Count total referred users
  const totalReferred = await Referral.countDocuments({ referrerId: userId });

  // Count converted referrals (users who made a purchase)
  const convertedReferrals = await Referral.countDocuments({
    referrerId: userId,
    status: 'converted'
  });

  // Count pending referrals
  const pendingReferrals = await Referral.countDocuments({
    referrerId: userId,
    status: 'pending'
  });

  // Calculate total credits earned from referrals
  const creditedReferrals = await Referral.countDocuments({
    referrerId: userId,
    credited: true
  });

  const referralCreditsPerConversion = parseInt(process.env.REFERRAL_CREDIT_AMOUNT || '2');
  const totalReferralCredits = creditedReferrals * referralCreditsPerConversion;

  return {
    totalReferredUsers: totalReferred,
    convertedUsers: convertedReferrals,
    pendingUsers: pendingReferrals,
    totalCreditsEarned: user.credits,
    creditsFromReferrals: totalReferralCredits,
    referralCode: user.referralCode,
    conversionRate: totalReferred > 0 ? ((convertedReferrals / totalReferred) * 100).toFixed(2) : '0.00'
  };
};

/**
 * Get user's referral link
 */
export const getUserReferralLink = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const referralLink = `${baseUrl}/register?ref=${user.referralCode}`;

  return {
    referralCode: user.referralCode,
    referralLink,
    shareMessage: `Join FileShare using my referral code ${user.referralCode} and get 2 credits on your first purchase!`
  };
};

/**
 * Validate a referral code
 */
export const checkReferralCode = async (referralCode: string) => {
  const user = await User.findOne({ referralCode: referralCode.toUpperCase() });

  if (!user) {
    return {
      valid: false,
      message: 'Invalid referral code'
    };
  }

  return {
    valid: true,
    referrerName: user.name,
    referralCode: user.referralCode,
    message: 'Valid referral code'
  };
};

/**
 * Get referral history with pagination
 */
export const fetchReferralHistory = async (userId: string, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const referrals = await Referral.find({ referrerId: userId })
    .populate('referredId', 'name email createdAt')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Referral.countDocuments({ referrerId: userId });

  return {
    referrals,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    }
  };
};
