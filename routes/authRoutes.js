const express = require('express');
const {login,register} = require("../controllers/authController");
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Register route
router.post('/register',register);
// login route
router.post('/login',login);
// protected test route
router.get('/profile', protect, (req, res) => {
  res.json({
    message: 'You have access!',
    user: req.user
  });
});

module.exports =router;
