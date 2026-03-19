// backend/models/Menu.js

const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Menu", menuSchema);