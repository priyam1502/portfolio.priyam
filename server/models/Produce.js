const mongoose = require('mongoose');

const produceSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['vegetables', 'fruits', 'grains', 'pulses', 'spices', 'others'],
    required: true
  },
  quantity: {
    available: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'ton', 'pieces', 'dozen'],
      required: true
    }
  },
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['per_kg', 'per_quintal', 'per_ton', 'per_piece', 'per_dozen'],
      required: true
    }
  },
  description: {
    type: String,
    maxlength: 500
  },
  images: [{
    type: String
  }],
  harvestDate: {
    type: Date
  },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  quality: {
    type: String,
    enum: ['premium', 'standard', 'economy'],
    default: 'standard'
  }
}, {
  timestamps: true
});

// Index for efficient searching
produceSchema.index({ cropName: 'text', category: 1 });
produceSchema.index({ 'location.city': 1, 'location.state': 1 });
produceSchema.index({ farmer: 1, isActive: 1 });

module.exports = mongoose.model('Produce', produceSchema);