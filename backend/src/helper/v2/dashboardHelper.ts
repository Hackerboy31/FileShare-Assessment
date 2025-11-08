import mongoose from 'mongoose';
import { User } from '../../models/User';
import { Referral } from '../../models/Referral';
import { Purchase } from '../../models/Purchase';
import { AppError } from '../../middleware/errorHandler';

/**
 * Calculate comprehensive dashboard statistics
 */
export const calculateDashboardStats = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Referral statistics
  const totalReferred = await Referral.countDocuments({ referrerId: userId });
  const convertedReferrals = await Referral.countDocuments({
    referrerId: userId,
    status: 'converted'
  });
  const pendingReferrals = await Referral.countDocuments({
    referrerId: userId,
    status: 'pending'
  });

  // Purchase statistics
  const totalPurchases = await Purchase.countDocuments({ userId });
  const firstPurchase = await Purchase.findOne({ userId, firstPurchase: true });

  // Calculate total spent
  const spentData = await Purchase.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const totalSpent = spentData.length > 0 ? spentData[0].total : 0;

  // Credits information
  const creditedReferrals = await Referral.countDocuments({
    referrerId: userId,
    credited: true
  });
  const referralCreditsPerConversion = parseInt(process.env.REFERRAL_CREDIT_AMOUNT || '2');

  return {
    user: {
      name: user.name,
      email: user.email,
      credits: user.credits,
      referralCode: user.referralCode,
      memberSince: user.createdAt
    },
    totalReferrals: totalReferred,
    successfulReferrals: convertedReferrals,
    referrals: {
      total: totalReferred,
      converted: convertedReferrals,
      pending: pendingReferrals,
      conversionRate: totalReferred > 0 ? ((convertedReferrals / totalReferred) * 100).toFixed(2) : '0.00'
    },
    purchases: {
      total: totalPurchases,
      totalSpent: totalSpent.toFixed(2),
      hasFirstPurchase: !!firstPurchase,
      firstPurchaseDate: firstPurchase?.purchaseDate
    },
    credits: {
      current: user.credits,
      earnedFromReferrals: creditedReferrals * referralCreditsPerConversion,
      earnedFromOwnPurchase: firstPurchase ? parseInt(process.env.REFERRED_CREDIT_AMOUNT || '2') : 0
    }
  };
};

/**
 * Calculate detailed dashboard metrics
 */
export const calculateDashboardMetrics = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Get referral data with user details
  const referrals = await Referral.find({ referrerId: userId })
    .populate('referredId', 'name email createdAt')
    .sort({ createdAt: -1 })
    .limit(5);

  // Get recent purchases
  const recentPurchases = await Purchase.find({ userId })
    .sort({ purchaseDate: -1 })
    .limit(5);

  // Get monthly referral trends (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyReferrals = await Referral.aggregate([
    {
      $match: {
        referrerId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 },
        converted: {
          $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] }
        }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Get monthly purchase trends
  const monthlyPurchases = await Purchase.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        purchaseDate: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$purchaseDate' },
          month: { $month: '$purchaseDate' }
        },
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  return {
    recentReferrals: referrals,
    recentPurchases,
    trends: {
      referrals: monthlyReferrals,
      purchases: monthlyPurchases
    },
    summary: {
      totalReferred: await Referral.countDocuments({ referrerId: userId }),
      totalConverted: await Referral.countDocuments({ referrerId: userId, status: 'converted' }),
      totalCredits: user.credits,
      referralCode: user.referralCode
    }
  };
};

/**
 * Fetch user activity log
 */
export const fetchUserActivity = async (userId: string, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  // Combine referrals and purchases into activity feed
  const referrals = await Referral.find({ referrerId: userId })
    .populate('referredId', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  const purchases = await Purchase.find({ userId })
    .sort({ purchaseDate: -1 })
    .lean();

  // Format activities
  const activities = [
    ...referrals.map(ref => ({
      type: 'referral',
      date: ref.createdAt,
      description: `Referred ${(ref.referredId as any)?.name || 'a user'}`,
      status: ref.status,
      credited: ref.credited
    })),
    ...purchases.map(pur => ({
      type: 'purchase',
      date: pur.purchaseDate,
      description: `Purchased ${pur.productName}`,
      amount: pur.amount,
      firstPurchase: pur.firstPurchase
    }))
  ];

  // Sort by date
  activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Paginate
  const paginatedActivities = activities.slice(skip, skip + limit);
  const total = activities.length;

  return {
    activities: paginatedActivities,
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
