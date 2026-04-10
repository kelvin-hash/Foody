const express = require("express");
// import the callbackdata model
const callback = require("../models/CallBackData");
// import the payment queue
const paymentQueue = require('../queues/paymentQueue')
const router = express.Router();
// the endpoint at which the mpesa callback hits
router.post("/callback",async (req,res)=>{
    console.log("Received callback:", req.body);
    try {
        // store the raw callback object
        await callback.create({

            payload:req.body
        });
        // push a job  to the queue for processing 
        console.log("Adding job to the queue");
        await paymentQueue.add("processPayment",req.body);
        console.log("Job added to the queue");
        // return a succes response to the client
        res.status(200).json({message:"received"});
    } catch (error) {
        console.log(error)
        res.status(200).json({message:"erorr logged"});
    }
});
module.exports = router;