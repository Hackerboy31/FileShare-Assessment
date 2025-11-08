import jwt from 'jsonwebtoken';
import { User, IUser } from '../../models/User';
import { Referral } from '../../models/Referral';
import { AppError } from '../../middleware/errorHandler';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  referralCode?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

/**
 * Generate JWT token
 */
export const generateToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpire = process.env.JWT_EXPIRE || '7d';

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return (jwt.sign as any)({ userId }, jwtSecret, { expiresIn: jwtExpire });
};

/**
 * Register a new user
 */
export const registerUser = async (input: RegisterInput) => {
  const { name, email, password, referralCode } = input;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  // Create new user
  const user = new User({
    name,
    email: email.toLowerCase(),
    passwordHash: password
  });

  await user.save();

  // If registered with a referral code, create referral relationship
  if (referralCode) {
    try {
      const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });

      if (referrer && referrer._id.toString() !== user._id.toString()) {
        const referral = new Referral({
          referrerId: referrer._id,
          referredId: user._id,
          status: 'pending',
          credited: false
        });

        await referral.save();
      }
    } catch (error) {
      // Log but don't fail registration if referral creation fails
      console.error('Error creating referral relationship:', error);
    }
  }

  // Generate token
  const token = generateToken(user._id);

  // Return user without password
  const userResponse = user.toJSON();

  return {
    user: userResponse,
    token,
    referralCode: user.referralCode
  };
};

/**
 * Login user
 */
export const loginUser = async (input: LoginInput) => {
  const { email, password } = input;

  // Find user with password field
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');

  if (!user) {
    throw new AppError('No user found with this email. Please create an account first.', 404);
  }

  // Check password
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new AppError('Invalid password. Please try again.', 401);
  }

  // Generate token
  const token = generateToken(user._id);

  // Return user without password
  const userResponse = user.toJSON();

  return {
    user: userResponse,
    token
  };
};

/**
 * Get user profile
 */
export const getUserProfile = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId).select('-passwordHash');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};
