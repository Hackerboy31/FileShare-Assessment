const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');

async function testNewUserReferral() {
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

    console.log('=== TESTING NEW USER WITH REFERRAL ===');

    // Get Ansh's referral code
    const referrer = await User.findOne({ name: 'Ansh' });
    if (!referrer) {
      console.log('Referrer not found');
      return;
    }

    console.log(`Using referral code: ${referrer.referralCode}`);

    // Create a new user with referral
    const newUserData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newUserData.password, salt);

    // Create new user
    const newUser = new User({
      name: newUserData.name,
      email: newUserData.email,
      passwordHash,
      credits: 0
    });

    // The referral code generation will happen in pre-save middleware
    await newUser.save();

    console.log(`Created new user: ${newUser.name} with referral code: ${newUser.referralCode}`);

    // Create referral record (this would normally happen during registration)
    const referral = new Referral({
      referrerId: referrer._id,
      referredId: newUser._id,
      status: 'pending',
      credited: false
    });
    await referral.save();

    console.log('Created referral record');

    // Check current state
    const updatedReferrer = await User.findById(referrer._id);
    const updatedNewUser = await User.findById(newUser._id);

    console.log(`Referrer credits: ${updatedReferrer.credits}`);
    console.log(`New user credits: ${updatedNewUser.credits}`);

    // Now simulate a purchase for the new user
    const Purchase = mongoose.model('Purchase', {
      userId: mongoose.Schema.Types.ObjectId,
      productId: String,
      productName: String,
      amount: Number,
      firstPurchase: Boolean,
      purchaseDate: Date
    });

    const purchase = new Purchase({
      userId: newUser._id,
      productId: 'test-product-456',
      productName: 'Premium Package',
      amount: 299,
      firstPurchase: true,
      purchaseDate: new Date()
    });
    await purchase.save();

    console.log('Created first purchase for new user');

    // Process referral credits (simulating purchase helper)
    const referralCreditAmount = 2;
    const referredCreditAmount = 2;

    await User.findByIdAndUpdate(referrer._id, { $inc: { credits: referralCreditAmount } });
    await User.findByIdAndUpdate(newUser._id, { $inc: { credits: referredCreditAmount } });

    // Update referral status
    referral.status = 'converted';
    referral.credited = true;
    referral.conversionDate = new Date();
    await referral.save();

    console.log('Processed referral credits');

    // Check final state
    const finalReferrer = await User.findById(referrer._id);
    const finalNewUser = await User.findById(newUser._id);

    console.log(`Final referrer credits: ${finalReferrer.credits}`);
    console.log(`Final new user credits: ${finalNewUser.credits}`);

    // Check referral stats
    const totalReferrals = await Referral.countDocuments({ referrerId: referrer._id });
    const convertedReferrals = await Referral.countDocuments({ referrerId: referrer._id, status: 'converted' });

    console.log(`Total referrals for referrer: ${totalReferrals}`);
    console.log(`Converted referrals: ${convertedReferrals}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testNewUserReferral();