const mongoose = require('mongoose');

async function checkUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/FileShare');

    const User = mongoose.model('User', {
      name: String,
      email: String,
      referralCode: String,
      credits: Number
    });

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
      status: String,
      credited: Boolean,
      conversionDate: Date
    });

    const users = await User.find({});
    console.log('Total users:', users.length);

    for (const user of users) {
      const purchaseCount = await Purchase.countDocuments({ userId: user._id });
      const purchaseCountString = await Purchase.countDocuments({ userId: user._id.toString() });
      const referralCount = await Referral.countDocuments({ referrerId: user._id });
      console.log(`User: ${user.name}, Email: ${user.email}, ID: ${user._id}, Referral Code: ${user.referralCode || 'MISSING'}, Credits: ${user.credits}, Purchases (ObjectId): ${purchaseCount}, Purchases (String): ${purchaseCountString}, Referrals: ${referralCount}`);
    }

    // Check if there's a user with the purchase userId
    const purchaseUser = await User.findById('690c648cd1d003097c2ab10d');
    if (purchaseUser) {
      console.log(`Purchase User found: ${purchaseUser.name}, Email: ${purchaseUser.email}, Credits: ${purchaseUser.credits}`);
    } else {
      console.log('Purchase User not found in User collection');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers();