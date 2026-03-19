const express = require("express");
const router = express.Router();
const axios = require("axios");
const Restaurant = require("../models/Restaraunt");
const MenuItem = require("../models/menuItem");
const mongoose = require("mongoose");

// Get all restaurants

router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get menu items for a specific restaurant
router.get("/:id/menu", async (req, res) => {
  try {
    const restaurantId = new mongoose.Types.ObjectId(req.params.id);
    const menuItems = await MenuItem.find({ restaurant: restaurantId });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;