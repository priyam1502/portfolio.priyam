const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const produceRoutes = require('./routes/produce');
const orderRoutes = require('./routes/orders');
const notificationRoutes = require('./routes/notifications');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/farmers_market';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/produce', produceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Farmers Market API is running',
    timestamp: new Date().toISOString()
  });
});

// Demo data endpoint for development
app.get('/api/demo-data', async (req, res) => {
  try {
    const User = require('./models/User');
    const Produce = require('./models/Produce');
    
    // Create demo farmer
    let demoFarmer = await User.findOne({ phone: '9876543210' });
    if (!demoFarmer) {
      demoFarmer = new User({
        name: 'Ramesh Kumar',
        phone: '9876543210',
        password: 'demo123',
        userType: 'farmer',
        location: {
          address: 'Village Greenfield',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411001',
          coordinates: { lat: 18.5204, lng: 73.8567 }
        }
      });
      await demoFarmer.save();
    }

    // Create demo buyer
    let demoBuyer = await User.findOne({ phone: '9876543211' });
    if (!demoBuyer) {
      demoBuyer = new User({
        name: 'Sunita Sharma',
        phone: '9876543211',
        password: 'demo123',
        userType: 'buyer',
        location: {
          address: 'MG Road',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411001',
          coordinates: { lat: 18.5204, lng: 73.8567 }
        }
      });
      await demoBuyer.save();
    }

    // Create demo produce
    const existingProduce = await Produce.findOne({ farmer: demoFarmer._id });
    if (!existingProduce) {
      const demoProduce = [
        {
          farmer: demoFarmer._id,
          cropName: 'Fresh Onions',
          category: 'vegetables',
          quantity: { available: 50, unit: 'kg' },
          price: { amount: 20, unit: 'per_kg' },
          description: 'Fresh red onions, directly from farm',
          location: demoFarmer.location,
          quality: 'premium'
        },
        {
          farmer: demoFarmer._id,
          cropName: 'Organic Tomatoes',
          category: 'vegetables',
          quantity: { available: 30, unit: 'kg' },
          price: { amount: 25, unit: 'per_kg' },
          description: 'Organic tomatoes, no pesticides used',
          location: demoFarmer.location,
          quality: 'premium'
        }
      ];

      await Produce.insertMany(demoProduce);
    }

    res.json({
      message: 'Demo data created successfully',
      demoAccounts: {
        farmer: { phone: '9876543210', password: 'demo123' },
        buyer: { phone: '9876543211', password: 'demo123' }
      }
    });
  } catch (error) {
    console.error('Demo data creation error:', error);
    res.status(500).json({ message: 'Error creating demo data' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Demo Data: http://localhost:${PORT}/api/demo-data`);
});

module.exports = app;