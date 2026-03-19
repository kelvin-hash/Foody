// backend/models/Restaurant.js

const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  cuisine: { type: String, required: true },
  ratings: { type: Number, default: 0 },
  area: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Restaurant", restaurantSchema);