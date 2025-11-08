const mongoose = require('mongoose');

async function checkPurchases() {
  try {
    await mongoose.connect('mongodb://localhost:27017/FileShare');

    const Purchase = mongoose.model('Purchase', {
      userId: mongoose.Schema.Types.ObjectId,
      productId: String,
      productName: String,
      amount: Number,
      firstPurchase: Boolean,
      purchaseDate: Date
    });

    const Referral = mongoose.model('Referral', {
      referrerId: mongoose.Schema.Types.ObjectId,
      referredId: mongoose.Schema.Types.ObjectId,
      status: { type: String, default: 'pending' },
      credited: { type: Boolean, default: false },
      conversionDate: Date,
      createdAt: Date,
      updatedAt: Date
    });

    const purchases = await Purchase.find({}).sort({ purchaseDate: -1 });
    console.log('Total purchases:', purchases.length);

    purchases.forEach((purchase, index) => {
      console.log(`${index + 1}. Purchase: ${purchase.productName}, User: ${purchase.userId}, Amount: $${purchase.amount}, First: ${purchase.firstPurchase}, Date: ${purchase.purchaseDate}`);
    });

    const referrals = await Referral.find({});
    console.log('Total referrals:', referrals.length);

    referrals.forEach((referral, index) => {
      console.log(`${index + 1}. Referral: Referrer: ${referral.referrerId}, Referred: ${referral.referredId}, Status: ${referral.status}, Credited: ${referral.credited}, Created: ${referral.createdAt}, Conversion: ${referral.conversionDate || 'N/A'}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkPurchases();