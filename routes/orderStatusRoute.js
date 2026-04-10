const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

const mongoose = require("mongoose");

router.get("/payment/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    console.log("Incoming orderId:", orderId);

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.log("Invalid ObjectId");
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      console.log("Order not found");
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      status: order.status,
    });

  } catch (err) {
    console.error("STATUS ROUTE ERROR:", err); // <-- THIS WAS MISSING
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;