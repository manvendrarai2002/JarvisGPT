import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  planId: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  credits: { type: Number, required: true, min: 0 },
  razorpayOrderId: { type: String, required: true, unique: true, index: true },
  razorpayPaymentId: { type: String, unique: true, sparse: true, index: true },
  razorpaySignature: { type: String },
  isPaid: { type: Boolean, default: false, index: true },
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
