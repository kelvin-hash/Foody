const stripe = require("../services/stripe/stripe");
const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Order = require("../models/Order");

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      console.log("Received Stripe webhook:");
      
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log("Webhook signature failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    //  Handle event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const { orderId, paymentId } = session.metadata;

      if (!orderId || !paymentId) {
        console.log("Missing orderId or paymentId in session metadata");
        return res.sendStatus(200);
      }
      try {
        const payment = await Payment.findById(paymentId);

        if (!payment) {
          console.log("Payment not found");
          return res.sendStatus(200);
        }

        if (payment.amount * 100 !== session.amount_total) {
          console.log("Amount mismatch");
          return res.sendStatus(200);
        }
        // prevent duplicate updates
        if (payment.status === "successful") {
          return res.sendStatus(200);
        }
        payment.status = "successful";
        payment.stripePaymentIntentId = session.payment_intent;

        await payment.save();

        const order = await Order.findByIdAndUpdate(orderId, {
          status: "paid",
      });

        if (!order) {
          console.log("Order not found for:", orderId);
        }

        console.log("Stripe webhook success", {
          eventId: event.id,
          paymentId,
          orderId,
          amount: session.amount_total,
        });
      } catch (error) {
        console.error("Webhook processing error:", error);
      }
    }
    if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object;
      const { paymentId } = session.metadata;

      const payment = await Payment.findById(paymentId);

      if (payment && payment.status !== "failed") {
        payment.status = "failed";
        await payment.save();

        await Order.findByIdAndUpdate(payment.orderId, {
          status: "payment_failed",
        });
      }
    }

    res.status(200).json({ received: true });
  }
);

module.exports = router;