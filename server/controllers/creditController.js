import Razorpay from 'razorpay';
import crypto from 'crypto';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

const plans = [
  { _id: 'basic', name: 'Basic', price: 100, credits: 100, features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models'] },
  { _id: 'pro', name: 'Pro', price: 200, credits: 500, features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time'] },
  { _id: 'premium', name: 'Premium', price: 300, credits: 1000, features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager'] },
];

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

function signaturesMatch(expected, received) {
  if (!expected || !received || expected.length !== received.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

export const getPlans = async (req, res) => {
  return res.json({ success: true, plans });
};

export const purchasePlan = async (req, res) => {
  try {
    const plan = plans.find((item) => item._id === req.body?.planId);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    const transaction = await Transaction.create({
      userId: req.user._id,
      planId: plan._id,
      amount: plan.price,
      credits: plan.credits,
      razorpayOrderId: `pending-${crypto.randomUUID()}`,
      isPaid: false,
    });

    const order = await razorpayInstance.orders.create({
      amount: plan.price * 100,
      currency: 'INR',
      receipt: transaction._id.toString(),
      notes: { transactionId: transaction._id.toString(), planId: plan._id },
    });

    transaction.razorpayOrderId = order.id;
    await transaction.save();

    return res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      transactionId: transaction._id,
    });
  } catch (error) {
    console.error('[payments/purchase]', error);
    return res.status(500).json({ success: false, message: 'Unable to create payment order' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !transactionId) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (!signaturesMatch(generatedSignature, razorpay_signature)) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    const transaction = await Transaction.findOne({
      _id: transactionId,
      userId: req.user._id,
      razorpayOrderId: razorpay_order_id,
    });

    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
    if (transaction.isPaid) return res.json({ success: true, message: 'Payment already verified' });

    // Confirm the Razorpay order belongs to the expected transaction amount/currency.
    const order = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (order.currency !== 'INR' || Number(order.amount) !== transaction.amount * 100) {
      return res.status(400).json({ success: false, message: 'Payment amount mismatch' });
    }

    const markedPaid = await Transaction.findOneAndUpdate(
      { _id: transaction._id, userId: req.user._id, isPaid: false },
      {
        $set: {
          isPaid: true,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      },
      { new: true }
    );

    if (!markedPaid) return res.json({ success: true, message: 'Payment already verified' });

    await User.findByIdAndUpdate(markedPaid.userId, { $inc: { credits: markedPaid.credits } });
    return res.json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    console.error('[payments/verify]', error);
    return res.status(500).json({ success: false, message: 'Unable to verify payment' });
  }
};

export { plans };
