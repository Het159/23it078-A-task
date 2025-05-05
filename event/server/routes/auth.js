const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working' });
});

// Register User
router.post('/register', register);

// Login User
router.post('/login', login);

// Get current user
router.get('/me', protect, getMe);

module.exports = router; 