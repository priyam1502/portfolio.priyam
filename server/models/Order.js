const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  produce: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produce',
    required: true
  },
  orderDetails: {
    cropName: String,
    quantity: {
      ordered: Number,
      unit: String
    },
    pricePerUnit: Number,
    totalAmount: Number
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'dispatched', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'upi', 'bank_transfer', 'card'],
    default: 'cash_on_delivery'
  },
  notes: {
    buyer: String,
    farmer: String
  },
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }]
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `FM${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Update timeline when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.timeline.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);