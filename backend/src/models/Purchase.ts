import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchase extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  productId: string;
  productName: string;
  amount: number;
  firstPurchase: boolean;
  purchaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    productId: {
      type: String,
      required: [true, 'Product ID is required'],
      trim: true
    },
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'Purchase amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    firstPurchase: {
      type: Boolean,
      default: false,
      required: true
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
      required: true
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

// Indexes for faster queries
PurchaseSchema.index({ userId: 1, purchaseDate: -1 });
PurchaseSchema.index({ userId: 1, firstPurchase: 1 });
PurchaseSchema.index({ purchaseDate: -1 });

// Pre-save middleware to check if this is user's first purchase
PurchaseSchema.pre('save', async function (next) {
  const purchase = this;

  try {
    // Check if user has any previous purchases
    const existingPurchases = await mongoose.models.Purchase.countDocuments({
      userId: purchase.userId,
      _id: { $ne: purchase._id }
    });

    purchase.firstPurchase = existingPurchases === 0;
    next();
  } catch (error: any) {
    next(error);
  }
});

export const Purchase = mongoose.model<IPurchase>('Purchase', PurchaseSchema);
