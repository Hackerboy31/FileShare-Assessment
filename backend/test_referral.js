const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');

async function testReferralSystem() {
  try {
    await mongoose.connect('mongodb://localhost:27017/FileShare');

    const User = mongoose.model('User', {
      name: String,
      email: String,
      passwordHash: String,
      referralCode: String,
      credits: Number
    });

    const Referral = mongoose.model('Referral', {
      referrerId: mongoose.Schema.Types.ObjectId,
      referredId: mongoose.Schema.Types.ObjectId,
      status: { type: String, default: 'pending' },
      credited: { type: Boolean, default: false },
      conversionDate: Date
    });

    const Purchase = mongoose.model('Purchase', {
      userId: mongoose.Schema.Types.ObjectId,
      productId: String,
      productName: String,
      amount: Number,
      firstPurchase: Boolean,
      purchaseDate: Date
    });

    console.log('=== REFERRAL SYSTEM TEST ===');

    // Get existing users
    const users = await User.find({});
    console.log(`Found ${users.length} existing users`);

    if (users.length < 2) {
      console.log('Need at least 2 users for referral test');
      return;
    }

    const referrer = users[0]; // Ansh
    const existingReferred = users[1]; // Shaurya

    console.log(`Referrer: ${referrer.name} (${referrer.referralCode})`);
    console.log(`Existing user to be "referred": ${existingReferred.name}`);

    // Check if referral already exists
    let referral = await Referral.findOne({
      referrerId: referrer._id,
      referredId: existingReferred._id
    });

    if (!referral) {
      // Create a referral record (simulating registration with referral code)
      referral = new Referral({
        referrerId: referrer._id,
        referredId: existingReferred._id,
        status: 'pending',
        credited: false
      });
      await referral.save();
      console.log('Created referral record');
    } else {
      console.log('Referral record already exists');
    }

    // Check current credits
    console.log(`Referrer credits before: ${referrer.credits}`);
    console.log(`Referred user credits before: ${existingReferred.credits}`);

    // Simulate a purchase for the referred user
    const existingPurchases = await Purchase.countDocuments({ userId: existingReferred._id });
    const isFirstPurchase = existingPurchases === 0;

    console.log(`Is first purchase for referred user: ${isFirstPurchase}`);

    if (isFirstPurchase) {
      const purchase = new Purchase({
        userId: existingReferred._id,
        productId: 'test-product-123',
        productName: 'Test Product',
        amount: 99,
        firstPurchase: true,
        purchaseDate: new Date()
      });
      await purchase.save();
      console.log('Created test purchase');

      // Award credits (simulating the purchase helper logic)
      const referralCreditAmount = 2;
      const referredCreditAmount = 2;

      await User.findByIdAndUpdate(referrer._id, { $inc: { credits: referralCreditAmount } });
      await User.findByIdAndUpdate(existingReferred._id, { $inc: { credits: referredCreditAmount } });

      // Update referral status
      referral.status = 'converted';
      referral.credited = true;
      referral.conversionDate = new Date();
      await referral.save();

      console.log('Awarded credits and updated referral status');
    }

    // Check credits after
    const updatedReferrer = await User.findById(referrer._id);
    const updatedReferred = await User.findById(existingReferred._id);

    console.log(`Referrer credits after: ${updatedReferrer.credits}`);
    console.log(`Referred user credits after: ${updatedReferred.credits}`);

    // Check final state
    const finalPurchases = await Purchase.find({ userId: existingReferred._id });
    const finalReferrals = await Referral.find({ referrerId: referrer._id });

    console.log(`Total purchases for referred user: ${finalPurchases.length}`);
    console.log(`Total referrals for referrer: ${finalReferrals.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testReferralSystem();