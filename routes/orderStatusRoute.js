const express = require("express");
const Order = require("../models/Order");

const router = express.Router();


// GET /api/payment/:orderId
router.get("/payment/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      status: order.status, // pending | paid | payment_failed
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;