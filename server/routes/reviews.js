const express = require('express');
const Review = require('../models/Review');
const User = require('../models/User');
const Car = require('../models/Car');
const auth = require('../middleware/auth');
const { sequelize } = require('../config/database');

const router = express.Router();

// Get reviews for a car
router.get('/car/:carId', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { carId: req.params.carId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'profilePicture']
      }],
      order: [['createdAt', 'DESC']]
    });

    // Calculate average rating using Sequelize
    const averageRating = await Review.findOne({
      where: { carId: req.params.carId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
      ],
      raw: true
    });

    res.json({
      reviews,
      averageRating: averageRating?.averageRating || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a review
router.post('/', auth, async (req, res) => {
  try {
    const { carId, rating, comment } = req.body;

    // Check if user already reviewed this car
    const existingReview = await Review.findOne({
      where: {
        carId,
        userId: req.user.id
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this car' });
    }

    const review = await Review.create({
      carId,
      userId: req.user.id,
      rating,
      comment
    });

    // Get review with user data
    const reviewWithUser = await Review.findByPk(review.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'profilePicture']
      }]
    });

    res.status(201).json(reviewWithUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a review
router.put('/:id', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.update({ rating, comment });

    const updatedReview = await Review.findByPk(review.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'profilePicture']
      }]
    });

    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.destroy();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like/Dislike a review
router.post('/:id/react', auth, async (req, res) => {
  try {
    const { action } = req.body; // 'like' or 'dislike'

    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (action === 'like') {
      await review.increment('likes');
    } else if (action === 'dislike') {
      await review.increment('dislikes');
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await review.reload(); // Reload to get updated values

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;