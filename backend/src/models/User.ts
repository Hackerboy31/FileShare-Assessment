import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  referralCode: string;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't return password by default
    },
    referralCode: {
      type: String,
      unique: true,
      required: false, // Will be generated in pre-save middleware
      uppercase: true
    },
    credits: {
      type: Number,
      default: 0,
      min: [0, 'Credits cannot be negative']
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        delete (ret as any).passwordHash;
        delete (ret as any).__v;
        return ret;
      }
    }
  }
);

// Indexes are automatically created for unique fields
// UserSchema.index({ email: 1 });
// UserSchema.index({ referralCode: 1 });

// Pre-save middleware to hash password and generate referral code
UserSchema.pre<IUser>('save', async function (next) {
  const user = this;

  // Only hash password if it's modified
  if (!user.isModified('passwordHash')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Generate unique referral code before saving
UserSchema.pre<IUser>('save', async function (next) {
  const user = this;

  // Generate referral code for new users or if it's missing
  if (this.isNew && !user.referralCode) {
    let isUnique = false;
    let code = '';

    while (!isUnique) {
      // Generate code like: USER123 (using first 4 chars of name + random)
      const namePrefix = user.name.substring(0, 4).toUpperCase().replace(/\s/g, '');
      const randomSuffix = nanoid(6).toUpperCase();
      code = `${namePrefix}${randomSuffix}`;

      const existing = await mongoose.models.User.findOne({ referralCode: code });
      if (!existing) {
        isUnique = true;
      }
    }

    user.referralCode = code;
  }

  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', UserSchema);
