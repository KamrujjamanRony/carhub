const express = require('express');
const Car = require('../models/Car');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get all cars with filters
router.get('/', async (req, res) => {
  try {
    const {
      brand,
      model,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      fuelType,
      transmission,
      location,
      page = 1,
      limit = 12
    } = req.query;

    let where = { isAvailable: true };

    // Build filter query
    if (brand) where.brand = { [Op.like]: `%${brand}%` };
    if (model) where.model = { [Op.like]: `%${model}%` };
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }
    
    if (minYear || maxYear) {
      where.year = {};
      if (minYear) where.year[Op.gte] = parseInt(minYear);
      if (maxYear) where.year[Op.lte] = parseInt(maxYear);
    }
    
    if (fuelType) where.fuelType = fuelType;
    if (transmission) where.transmission = transmission;
    if (location) where['$location.city$'] = { [Op.like]: `%${location}%` };

    const cars = await Car.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'email', 'phone', 'dealerInfo']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      cars: cars.rows,
      totalPages: Math.ceil(cars.count / limit),
      currentPage: parseInt(page),
      total: cars.count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single car
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'email', 'phone', 'dealerInfo']
      }]
    });

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Increment views
    car.views += 1;
    await car.save();

    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create car listing
router.post('/', auth, async (req, res) => {
  try {
    const carData = {
      ...req.body,
      sellerId: req.user.id,
      sellerType: req.user.role === 'dealer' ? 'dealer' : 'individual'
    };

    const car = await Car.create(carData);
    const carWithSeller = await Car.findByPk(car.id, {
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'email', 'phone', 'dealerInfo']
      }]
    });

    res.status(201).json(carWithSeller);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Compare cars
router.post('/compare', async (req, res) => {
  try {
    const { carIds } = req.body;
    
    if (!carIds || carIds.length < 2 || carIds.length > 4) {
      return res.status(400).json({ 
        message: 'Please provide 2 to 4 car IDs for comparison' 
      });
    }

    const cars = await Car.findAll({
      where: { id: carIds },
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'dealerInfo']
      }]
    });

    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;