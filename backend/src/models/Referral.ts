import mongoose, { Schema, Document } from 'mongoose';

export interface IReferral extends Document {
  _id: string;
  referrerId: mongoose.Types.ObjectId;
  referredId: mongoose.Types.ObjectId;
  status: 'pending' | 'converted';
  credited: boolean;
  conversionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReferralSchema: Schema = new Schema(
  {
    referrerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Referrer ID is required']
    },
    referredId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Referred user ID is required']
    },
    status: {
      type: String,
      enum: ['pending', 'converted'],
      default: 'pending',
      required: true
    },
    credited: {
      type: Boolean,
      default: false,
      required: true
    },
    conversionDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        delete (ret as any).__v;
        return ret;
      }
    }
  }
);

// Compound index to prevent duplicate referrals
ReferralSchema.index({ referrerId: 1, referredId: 1 }, { unique: true });

// Indexes for faster queries
ReferralSchema.index({ referrerId: 1, status: 1 });
ReferralSchema.index({ referredId: 1 });
ReferralSchema.index({ status: 1 });
ReferralSchema.index({ credited: 1 });

// Validation: referrer and referred cannot be the same
ReferralSchema.pre<IReferral>('save', function (next) {
  if (this.referrerId.equals(this.referredId)) {
    next(new Error('User cannot refer themselves'));
  }
  next();
});

export const Referral = mongoose.model<IReferral>('Referral', ReferralSchema);
