const express = require('express');
const { body, validationResult } = require('express-validator');
const Produce = require('../models/Produce');
const User = require('../models/User');
const { auth, farmerOnly } = require('../middleware/auth');

const router = express.Router();

// Get all produce listings (public)
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      category, 
      city, 
      state, 
      minPrice, 
      maxPrice, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = { isActive: true, 'quantity.available': { $gt: 0 } };

    if (search) {
      query.$text = { $search: search };
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    if (state) {
      query['location.state'] = new RegExp(state, 'i');
    }

    if (minPrice || maxPrice) {
      query['price.amount'] = {};
      if (minPrice) query['price.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) query['price.amount'].$lte = parseFloat(maxPrice);
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const produce = await Produce.find(query)
      .populate('farmer', 'name phone location')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Produce.countDocuments(query);

    res.json({
      produce,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Fetch produce error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single produce item
router.get('/:id', async (req, res) => {
  try {
    const produce = await Produce.findById(req.params.id)
      .populate('farmer', 'name phone location profileImage');

    if (!produce) {
      return res.status(404).json({ message: 'Produce not found' });
    }

    res.json(produce);
  } catch (error) {
    console.error('Fetch produce error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new produce listing (farmers only)
router.post('/', auth, farmerOnly, [
  body('cropName').trim().isLength({ min: 2 }).withMessage('Crop name must be at least 2 characters'),
  body('category').isIn(['vegetables', 'fruits', 'grains', 'pulses', 'spices', 'others']).withMessage('Invalid category'),
  body('quantity.available').isNumeric().isFloat({ min: 0.1 }).withMessage('Quantity must be greater than 0'),
  body('quantity.unit').isIn(['kg', 'quintal', 'ton', 'pieces', 'dozen']).withMessage('Invalid quantity unit'),
  body('price.amount').isNumeric().isFloat({ min: 0.1 }).withMessage('Price must be greater than 0'),
  body('price.unit').isIn(['per_kg', 'per_quintal', 'per_ton', 'per_piece', 'per_dozen']).withMessage('Invalid price unit'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const produceData = {
      ...req.body,
      farmer: req.user._id,
      location: req.body.location || req.user.location
    };

    const produce = new Produce(produceData);
    await produce.save();

    const populatedProduce = await Produce.findById(produce._id)
      .populate('farmer', 'name phone location');

    res.status(201).json({
      message: 'Produce listing created successfully',
      produce: populatedProduce
    });
  } catch (error) {
    console.error('Create produce error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update produce listing (farmers only)
router.put('/:id', auth, farmerOnly, async (req, res) => {
  try {
    const produce = await Produce.findById(req.params.id);

    if (!produce) {
      return res.status(404).json({ message: 'Produce not found' });
    }

    // Check if user owns this produce
    if (produce.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedProduce = await Produce.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('farmer', 'name phone location');

    res.json({
      message: 'Produce updated successfully',
      produce: updatedProduce
    });
  } catch (error) {
    console.error('Update produce error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete produce listing (farmers only)
router.delete('/:id', auth, farmerOnly, async (req, res) => {
  try {
    const produce = await Produce.findById(req.params.id);

    if (!produce) {
      return res.status(404).json({ message: 'Produce not found' });
    }

    // Check if user owns this produce
    if (produce.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Produce.findByIdAndDelete(req.params.id);

    res.json({ message: 'Produce listing deleted successfully' });
  } catch (error) {
    console.error('Delete produce error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get farmer's own produce listings
router.get('/farmer/my-listings', auth, farmerOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const produce = await Produce.find({ farmer: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Produce.countDocuments({ farmer: req.user._id });

    res.json({
      produce,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Fetch farmer produce error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;