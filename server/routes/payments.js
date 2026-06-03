const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_test_key');
const auth = require('../middleware/auth');
const Car = require('../models/Car');

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { carId, amount } = req.body;

    const car = await Car.findByPk(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (!car.isAvailable) {
      return res.status(400).json({ message: 'Car is no longer available' });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        carId: carId.toString(),
        userId: req.user.id.toString(),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Handle successful payment
router.post('/success', auth, async (req, res) => {
  try {
    const { paymentIntentId, carId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    // Mark car as sold
    const car = await Car.findByPk(carId);
    await car.update({ isAvailable: false });

    // Here you would typically create an order record in your database
    // and generate an invoice

    res.json({ 
      message: 'Payment successful', 
      paymentIntent 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payment history
router.get('/history', auth, async (req, res) => {
  try {
    res.json({ 
      message: 'Payment history endpoint - implement based on your payment recording system' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;