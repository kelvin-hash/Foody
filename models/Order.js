const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    // 
    // refrence to the user making the order(FK)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
//   which restraunt the order is going to
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
//   what items are being orders an array of items
  items: [
    {
      menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
      name: { type: String, required: true }, // snapshot of menu item
      price: { type: Number, required: true }, // snapshot price
      quantity: { type: Number, required: true },
    },
  ],
//   the order amout
  totalAmount: { type: Number, required: true },
//   stauts of the order defaulted to pending
  status: { type: String, enum: ["pending","paid", "completed", "cancelled"], default: "pending" },
//the payment method
  paymentMethod:{type:String,enum:["mpesa","cash","stripe"],required:true}, 
//   where the order is suppossed to be delivered
  deliveryLocation: {
    lat: { type: Number },
    long: { type: Number },
    address: { type: String },
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
