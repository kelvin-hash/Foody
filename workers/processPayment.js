// import dotenv to access environment variables
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
// import mongoose to connect to the database
const mongoose = require("mongoose");
// connect to the database
mongoose.connect(process.env.MONGOOSE_URI)
    .then(()=>console.log("succesully connected to the db"))
    .catch((error)=>console.log('error occurred while connecting:',error));
// import the worker to work on a job
const { Worker } = require("bullmq");
// import ioredis to esablish a connection to redis
const IORedis = require("ioredis");
// import payment and order models
const Payment = require("../models/Payment");
const Order = require("../models/Order");
// initiate a connection to redis
const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: process.env.REDIS_URL.includes("rediss://") ? {} : undefined
});
// intantiate an instance of a worker
new Worker(
    // the name of the queue
  "paymentQueue",
  async (job) => {
    // start a session to guarantee atomicity
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
    
    // get the stkcallback from the body of the pulled callback
      const stkCallback = job.data.Body.stkCallback;
    // retrive all the values needed from the callback
      const checkoutRequestID = stkCallback.CheckoutRequestID;
      const resultCode = stkCallback.ResultCode;
      const resultDesc = stkCallback.ResultDesc;
    //use the payment model to find a document whose request id matches the one in the callback 
      const payment = await Payment.findOne(
        { checkoutRequestID },
        null,
        { session }
      );
      console.log("Payment found:", payment);

      if (!payment) {
        await session.abortTransaction();
        session.endSession();
        return;
      }

      // If already successful, ensure order is also correct
      if (payment.status === "successful") {

        await Order.findByIdAndUpdate(
          payment.orderId,
          { status: "paid" },
          { session }
        );

        await session.commitTransaction();
        session.endSession();
        return;
      }

      // Update payment
      payment.resultCode = resultCode;
      payment.resultDesc = resultDesc;

      if (Number(resultCode) === 0) {

        payment.status = "successful";

        const metadata = stkCallback.CallbackMetadata?.Item;

        const receipt = metadata?.find(
          item => item.Name === "MpesaReceiptNumber"
        )?.Value;

        payment.mpesaReceiptNumber = receipt;

        await payment.save({ session });

        await Order.findByIdAndUpdate(
          payment.orderId,
          { status: "paid" },
          { session }
        );

      } else {

        payment.status = "failed";
        await payment.save({ session });
      }

      await session.commitTransaction();
      session.endSession();
      
    } catch (error) {

      await session.abortTransaction();
      session.endSession();

      throw error; // let BullMQ retry
    }
  },
  { connection }
);

console.log("Payment worker is running...");