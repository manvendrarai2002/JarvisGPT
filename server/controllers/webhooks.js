import Razorpay from 'razorpay';
import crypto from 'crypto';
import Transaction from "../models/Transaction.js";
import User from '../models/User.js';

const plans = [
    {
        _id: "basic",
        name: "Basic",
        price: 10,
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
    },
    {
        _id: "pro",
        name: "Pro",
        price: 20,
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
    },
    {
        _id: "premium",
        name: "Premium",
        price: 30,
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
    }
];

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const getPlans = async (req, res) => {
    try {
        res.json({ success: true, plans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createOrder = async (req, res) => {
    try {
        const { planId } = req.body;
        const userId = req.user._id;
        const plan = plans.find(p => p._id === planId);

        if (!plan) {
            return res.status(404).json({ success: false, message: "Plan not found" });
        }

        const transaction = await Transaction.create({
            userId: userId,
            planId: plan._id,
            amount: plan.price,
            credits: plan.credits,
            isPaid: false,
        });

        const options = {
            amount: plan.price * 100,
            currency: "INR",
            receipt: transaction._id.toString(),
            notes: {
                transactionId: transaction._id.toString(),
                appId: 'jarvisgpt'
            }
        };

        const order = await razorpayInstance.orders.create(options);

        if (!order) {
            return res.status(500).json({ success: false, message: "Error creating order" });
        }
        
        transaction.razorpayOrderId = order.id;
        await transaction.save();

        res.json({ success: true, order, transactionId: transaction._id });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            transactionId
        } = req.body;
        
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Payment verification failed: Invalid signature' });
        }

        const transaction = await Transaction.findById(transactionId);
        
        if (!transaction) {
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }
        
        if (transaction.isPaid) {
            return res.json({ success: true, message: 'Payment already verified' });
        }

        transaction.razorpayPaymentId = razorpay_payment_id;
        transaction.razorpaySignature = razorpay_signature;
        transaction.isPaid = true;
        await transaction.save();

        await User.findByIdAndUpdate(transaction.userId, {
            $inc: { credits: transaction.credits }
        });

        res.json({ success: true, message: 'Payment verified successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const razorpayWebhook = async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest !== req.headers['x-razorpay-signature']) {
        return res.status(400).json({ status: 'error', message: 'Invalid signature' });
    }

    try {
        const event = req.body;
        
        if (event.event === 'payment.captured') {
            const payment = event.payload.payment.entity;
            const { transactionId, appId } = payment.notes;

            if (appId === 'jarvisgpt') {
                const transaction = await Transaction.findOne({ _id: transactionId, isPaid: false });

                if (transaction) {
                    await User.updateOne({ _id: transaction.userId }, { $inc: { credits: transaction.credits } });

                    transaction.isPaid = true;
                    transaction.razorpayPaymentId = payment.id;
                    await transaction.save();
                }
            } else {
                 return res.json({ status: 'ignored', message: 'Invalid app id' });
            }
        }
        
        res.json({ status: 'ok' });

    } catch (error) {
        console.log("Webhook processing error:", error);
        res.status(500).send("Internal Server Error");
    }
};

