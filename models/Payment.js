const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["cash", "stripe", "mpesa"], required: true },
  status: { type: String, enum: ["pending", "successful", "failed"], default: "pending" },
  mpesaReceiptNumber: { type: String },
  stripePaymentIntentId: { type: String },
  checkoutRequestID: { type: String }, // <-- store this immediately after initiating STK push
  resultCode: { type: Number },        // <-- Mpesa callback result
  resultDesc: { type: String },        // <-- Mpesa callback description
  transactionDate: { type: Date },
  phoneNumber: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);