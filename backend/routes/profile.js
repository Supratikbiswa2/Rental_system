const express  = require('express');
const User     = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const router   = express.Router();

// ── GET /api/profile ──────────────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

// ── PUT /api/profile ──────────────────────────────────────────────────────
router.put('/', protect, async (req, res) => {
  const { fullName, phone, city, prefs } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (fullName !== undefined) user.fullName = fullName;
  if (phone    !== undefined) user.phone    = phone;
  if (city     !== undefined) user.city     = city;
  if (prefs    !== undefined) user.prefs    = { ...user.prefs, ...prefs };

  const updated = await user.save();

  res.json({
    id:        updated._id,
    fullName:  updated.fullName,
    email:     updated.email,
    phone:     updated.phone,
    city:      updated.city,
    prefs:     updated.prefs,
    createdAt: updated.createdAt,
  });
});

module.exports = router;