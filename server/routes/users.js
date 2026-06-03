const express = require('express');
const User = require('../models/User');
const Car = require('../models/Car');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and account management
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned successfully
 *       401:
 *         description: Unauthorized
 */

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, address, dealerInfo } = req.body;

    const user = await User.findByPk(req.user.id);
    await user.update({
      name,
      phone,
      ...(req.user.role === 'dealer' && { dealerInfo })
    });

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's listed cars
router.get('/my-cars', auth, async (req, res) => {
  try {
    const cars = await Car.findAll({
      where: { sellerId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's favorite cars
router.get('/favorites', auth, async (req, res) => {
  try {
    res.json({ message: 'Favorites endpoint - implement as needed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change user role (admin only)
router.patch('/role', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { userId, role } = req.body;

    if (!['buyer', 'seller', 'dealer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByPk(userId);
    await user.update({ role });

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;