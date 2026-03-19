const express = require('express');
const router = express.Router();
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const Menu = require("../models/menuItem");
const mongoose = require("mongoose");
const { stkPush } = require("../services/mpesa/service");
const {protect} = require("../middleware/authMiddleware");

// Checkout route
router.post("/checkout", protect, async (req, res) => {
  const session = await mongoose.startSession(); // optional if using transactions
  session.startTransaction();

  try {
    const userId = req.user._id; // get user ID from auth middleware
    const { restaurantId, items, location, paymentMethod, phoneNumber } = req.body;

    // 1️⃣ Validate request
    if (!userId || !restaurantId || !items?.length || !location || !paymentMethod || !phoneNumber) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurant id" });
    }

    // 2️⃣ Fetch menu items from DB
    const menuItemIds = items.map(i => i._id);
    const menuItems = await Menu.find({ _id: { $in: menuItemIds } });
    if (menuItems.length !== items.length) {
      return res.status(400).json({ message: "One or more menu items are invalid" });
    }

    // 3️⃣ Prepare order items and calculate total
    let totalAmount = 0;
    const orderItems = menuItems.map(menuItem => {
      const item = items.find(i => i._id === menuItem._id.toString());
      totalAmount += item.quantity * menuItem.price;
      return {
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity
      };
    });

    // 4️⃣ Create order (status: pending)
    const order = new Order({
      userId,
      restaurantId,
      items: orderItems,
      totalAmount,
      paymentMethod,
      deliveryLocation: location,
      status: "pending"
    });
    await order.save({ session });

    // 5️⃣ Initiate payment if mpesa
    let payment = null;
    if (paymentMethod === "mpesa") {
      try {
        const result = await stkPush(1, phoneNumber); // replace with actual phone
        console.log(result);
        payment = new Payment({
          orderId: order._id,
          amount: totalAmount,
          method: "mpesa",
          checkoutRequestID: result.CheckoutRequestID,
          status: "pending",
          phoneNumber: phoneNumber
        });
        await payment.save({ session });
        console.log("1");
      } catch (err) {
        // mark order as failed if payment initiation fails
        await Order.findByIdAndUpdate(order._id, { status: "payment_failed" }, { session });
        await session.commitTransaction();
        session.endSession();
        return res.status(500).json({ message: "Payment initiation failed", error: err.message });
      }
    }

    await session.commitTransaction();
    session.endSession();

    // 6️⃣ Respond to client
    res.status(201).json({
      message: "Order created successfully",
      orderId: order._id,
      totalAmount,
      paymentId: payment?._id || null,
      paymentPending: paymentMethod === "mpesa"
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error processing checkout:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;