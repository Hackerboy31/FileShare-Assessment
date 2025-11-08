const mongoose = require('mongoose');

async function awardExistingReferralCredits() {
  try {
    await mongoose.connect('mongodb://localhost:27017/FileShare');

    const User = mongoose.model('User', {
      name: String,
      email: String,
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

    console.log('=== AWARDING EXISTING REFERRAL CREDITS ===');

    // Find the pending referral
    const referral = await Referral.findOne({ status: 'pending', credited: false });

    if (!referral) {
      console.log('No pending referrals found');
      return;
    }

    console.log(`Found referral: ${referral._id}`);
    console.log(`Referrer: ${referral.referrerId}`);
    console.log(`Referred: ${referral.referredId}`);

    // Get user details
    const referrer = await User.findById(referral.referrerId);
    const referred = await User.findById(referral.referredId);

    if (!referrer || !referred) {
      console.log('Users not found');
      return;
    }

    console.log(`Referrer: ${referrer.name}, Credits: ${referrer.credits}`);
    console.log(`Referred: ${referred.name}, Credits: ${referred.credits}`);

    // Award credits
    const referralCreditAmount = 2;
    const referredCreditAmount = 2;

    await User.findByIdAndUpdate(referral.referrerId, { $inc: { credits: referralCreditAmount } });
    await User.findByIdAndUpdate(referral.referredId, { $inc: { credits: referredCreditAmount } });

    // Update referral status
    referral.status = 'converted';
    referral.credited = true;
    referral.conversionDate = new Date();
    await referral.save();

    console.log(`Awarded ${referralCreditAmount} credits to referrer`);
    console.log(`Awarded ${referredCreditAmount} credits to referred user`);

    // Check final credits
    const updatedReferrer = await User.findById(referral.referrerId);
    const updatedReferred = await User.findById(referral.referredId);

    console.log(`Final referrer credits: ${updatedReferrer.credits}`);
    console.log(`Final referred credits: ${updatedReferred.credits}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

awardExistingReferralCredits();