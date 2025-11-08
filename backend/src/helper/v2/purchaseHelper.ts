import mongoose from 'mongoose';
import { User } from '../../models/User';
import { Purchase } from '../../models/Purchase';
import { Referral } from '../../models/Referral';
import { AppError } from '../../middleware/errorHandler';

interface PurchaseInput {
  userId: string;
  productId: string;
  productName: string;
  amount: number;
}

/**
 * Process a purchase and handle referral credits
 * This is the core business logic for the referral system
 */
export const processPurchase = async (input: PurchaseInput) => {
  const { userId, productId, productName, amount } = input;

  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if this is user's first purchase
    const existingPurchases = await Purchase.countDocuments({ userId });
    const isFirstPurchase = existingPurchases === 0;

    // Create purchase record
    const purchase = new Purchase({
      userId,
      productId,
      productName,
      amount,
      firstPurchase: isFirstPurchase,
      purchaseDate: new Date()
    });

    await purchase.save();

    let creditsAwarded = 0;
    let referralProcessed = false;

    // If this is first purchase, process referral credits
    if (isFirstPurchase) {
      // Check if user was referred by someone
      const referral = await Referral.findOne({
        referredId: userId,
        credited: false
      });

      if (referral) {
        const referralCreditAmount = parseInt(process.env.REFERRAL_CREDIT_AMOUNT || '2');
        const referredCreditAmount = parseInt(process.env.REFERRED_CREDIT_AMOUNT || '2');

        // Give credits to referrer
        await User.findByIdAndUpdate(
          referral.referrerId,
          { $inc: { credits: referralCreditAmount } }
        );

        // Give credits to referred user (current user)
        await User.findByIdAndUpdate(
          userId,
          { $inc: { credits: referredCreditAmount } }
        );

        // Update referral status
        referral.status = 'converted';
        referral.credited = true;
        referral.conversionDate = new Date();
        await referral.save();

        creditsAwarded = referredCreditAmount;
        referralProcessed = true;
      }
    }

    // Fetch updated user data
    const updatedUser = await User.findById(userId);

    return {
      purchase: purchase.toJSON(),
      isFirstPurchase,
      referralProcessed,
      creditsAwarded,
      totalCredits: updatedUser?.credits || 0,
      message: isFirstPurchase
        ? referralProcessed
          ? `Purchase successful! You earned ${creditsAwarded} credits from your referral.`
          : 'Purchase successful! This is your first purchase.'
        : 'Purchase successful!'
    };
  } catch (error: any) {
    throw error;
  }
};

/**
 * Fetch purchase history for a user
 */
export const fetchPurchaseHistory = async (userId: string, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const purchases = await Purchase.find({ userId })
    .sort({ purchaseDate: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Purchase.countDocuments({ userId });

  // Calculate total amount spent
  const totalSpent = await Purchase.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  return {
    purchases,
    totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
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

/**
 * Fetch purchases for any user (admin function)
 */
export const fetchUserPurchases = async (userId: string, page: number = 1, limit: number = 10) => {
  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return await fetchPurchaseHistory(userId, page, limit);
};
