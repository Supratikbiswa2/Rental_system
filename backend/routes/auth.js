const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const router  = express.Router();

// Helper: generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── POST /api/auth/signup ─────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password)
    return res.status(400).json({ message: 'Please fill in all fields' });

  if (password.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters' });

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(400).json({ message: 'An account with this email already exists' });

  const user = await User.create({ fullName, email, password });

  res.status(201).json({
    token: generateToken(user._id),
    user: {
      id:        user._id,
      fullName:  user.fullName,
      email:     user.email,
      createdAt: user.createdAt,
    },
  });
});

// ── POST /api/auth/login ──────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Please enter your email and password' });

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid email or password' });

  res.json({
    token: generateToken(user._id),
    user: {
      id:        user._id,
      fullName:  user.fullName,
      email:     user.email,
      createdAt: user.createdAt,
    },
  });
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────
// Verify token and return current user (used on page refresh)
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json({
    id:        user._id,
    fullName:  user.fullName,
    email:     user.email,
    phone:     user.phone,
    city:      user.city,
    prefs:     user.prefs,
    createdAt: user.createdAt,
  });
});

module.exports = router;