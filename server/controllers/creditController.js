import Razorpay from 'razorpay';
import crypto from 'crypto';
import Transaction from "../models/Transaction.js";
import User from '../models/User.js'; // You'll need your User model to add credits

// --- IMPORTANT ---
// The prices below are currently in USD. Razorpay primarily works with INR.
// For this code to work, I am assuming the price is in INR (e.g., price: 10 means ₹10).
// If you want to accept international payments, you'll need to enable it in your Razorpay dashboard.
const plans = [
    {
        _id: "basic",
        name: "Basic",
        price: 100, // Now ₹100
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
    },
    {
        _id: "pro",
        name: "Pro",
        price: 200, // Now ₹200
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
    },
    {
        _id: "premium",
        name: "Premium",
        price: 300, // Now ₹300
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
    }
];

// Initialize Razorpay instance
// Make sure you have RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// API Controller for getting all plans
export const getPlans = async (req, res) => {
    try {
        res.json({ success: true, plans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// API Controller for creating a Razorpay order
export const purchasePlan = async (req, res) => {
    try {
        const { planId } = req.body;
        const plan = plans.find(p => p._id === planId);

        if (!plan) {
            return res.status(404).json({ success: false, message: "Plan not found" });
        }

        const options = {
            amount: plan.price * 100, // Amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_order_${new Date().getTime()}`,
        };

        const order = await razorpayInstance.orders.create(options);

        if (!order) {
            return res.status(500).json({ success: false, message: "Error creating order" });
        }

        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// API Controller for verifying the payment
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            planId // You should send this from the client
        } = req.body;
        
        const userId = req.user._id;

        // Find the plan to get credit details
        const plan = plans.find(p => p._id === planId);
        if (!plan) {
            return res.status(404).json({ success: false, message: "Plan not found during verification" });
        }
        
        // Create the signature for verification
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Payment verification failed: Invalid signature' });
        }

        // If signature is valid, payment is authentic.
        // 1. Create a transaction record in your database.
        await Transaction.create({
            userId: userId,
            planId: plan._id,
            amount: plan.price,
            credits: plan.credits,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            isPaid: true, // Mark as paid
        });

        // 2. Add the purchased credits to the user's account.
        await User.findByIdAndUpdate(userId, {
            $inc: { credits: plan.credits } // Use $inc to increment credits
        });

        res.json({ success: true, message: 'Payment verified successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

