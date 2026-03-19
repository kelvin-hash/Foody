 const mongoose= require("mongoose");

 const callback = new mongoose.Schema({
    // the payment to which the callback is for
    payment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Payment"
    },
    payload: {
      type: Object,
      required: true
    },
 },
  { timestamps: true }
 );
 module.exports = mongoose.model("CallBackData",callback);