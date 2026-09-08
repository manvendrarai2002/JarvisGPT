import Razorpay from 'razorpay';
import crypto from 'crypto';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

const plans = [
  { _id: 'basic', name: 'Basic', price: 10, credits: 100, features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models'] },
  { _id: 'pro', name: 'Pro', price: 20, credits: 500, features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time'] },
  { _id: 'premium', name: 'Premium', price: 30, credits: 1000, features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager'] }
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
  res.json({ success: true, plans });
};

export const createOrder = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;
    const plan = plans.find((p) => p._id === planId);

    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    const transaction = await Transaction.create({
      userId,
      planId: plan._id,
      amount: plan.price,
      credits: plan.credits,
      isPaid: false,
    });

    const order = await razorpayInstance.orders.create({
      amount: plan.price * 100,
      currency: 'INR',
      receipt: transaction._id.toString(),
      notes: { transactionId: transaction._id.toString(), appId: 'jarvisgpt' },
    });

    transaction.razorpayOrderId = order.id;
    await transaction.save();

    return res.json({ success: true, order, transactionId: transaction._id });
  } catch (error) {
    console.error('[payments/create-order]', error);
    return res.status(500).json({ success: false, message: 'Unable to create payment order' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !transactionId) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
    }

    const generated = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (!signaturesMatch(generated, razorpay_signature)) {
      return res.status(400).json({ success: false, message: 'Payment verification failed: invalid signature' });
    }

    const transaction = await Transaction.findOne({
      _id: transactionId,
      razorpayOrderId: razorpay_order_id,
      userId: req.user._id,
    });

    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
    if (transaction.isPaid) return res.json({ success: true, message: 'Payment already verified' });

    transaction.razorpayPaymentId = razorpay_payment_id;
    transaction.razorpaySignature = razorpay_signature;
    transaction.isPaid = true;
    await transaction.save();

    await User.findByIdAndUpdate(transaction.userId, { $inc: { credits: transaction.credits } });
    return res.json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    console.error('[payments/verify]', error);
    return res.status(500).json({ success: false, message: 'Unable to verify payment' });
  }
};

export const razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const receivedSignature = req.headers['x-razorpay-signature'];

  if (!secret || !Buffer.isBuffer(req.body) || !receivedSignature) {
    return res.status(400).json({ status: 'error', message: 'Invalid webhook configuration' });
  }

  const expectedSignature = crypto.createHmac('sha256', secret).update(req.body).digest('hex');
  if (!signaturesMatch(expectedSignature, receivedSignature)) {
    return res.status(400).json({ status: 'error', message: 'Invalid signature' });
  }

  try {
    const event = JSON.parse(req.body.toString('utf8'));

    if (event.event === 'payment.captured') {
      const payment = event.payload?.payment?.entity;
      const transactionId = payment?.notes?.transactionId;
      const appId = payment?.notes?.appId;

      if (appId === 'jarvisgpt' && transactionId) {
        const transaction = await Transaction.findOne({ _id: transactionId, isPaid: false });
        if (transaction) {
          await User.updateOne({ _id: transaction.userId }, { $inc: { credits: transaction.credits } });
          transaction.isPaid = true;
          transaction.razorpayPaymentId = payment.id;
          await transaction.save();
        }
      }
    }

    return res.json({ status: 'ok' });
  } catch (error) {
    console.error('[payments/webhook]', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};
