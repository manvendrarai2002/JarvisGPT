import crypto from 'crypto';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

function signaturesMatch(expected, received) {
  if (!expected || !received || expected.length !== received.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

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

      if (transactionId) {
        const markedPaid = await Transaction.findOneAndUpdate(
          { _id: transactionId, isPaid: false },
          { $set: { isPaid: true, razorpayPaymentId: payment.id } },
          { new: true }
        );

        if (markedPaid) {
          await User.updateOne(
            { _id: markedPaid.userId },
            { $inc: { credits: markedPaid.credits } }
          );
        }
      }
    }

    return res.json({ status: 'ok' });
  } catch (error) {
    console.error('[payments/webhook]', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};
