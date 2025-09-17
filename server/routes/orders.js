const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Produce = require('../models/Produce');
const Notification = require('../models/Notification');
const { auth, farmerOnly, buyerOnly } = require('../middleware/auth');

const router = express.Router();

// Create notification helper
const createNotification = async (recipientId, senderId, type, title, message, orderId = null) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type,
      title,
      message,
      relatedOrder: orderId
    });
    await notification.save();
  } catch (error) {
    console.error('Notification creation error:', error);
  }
};

// Place order (buyers only)
router.post('/', auth, buyerOnly, [
  body('produceId').isMongoId().withMessage('Invalid produce ID'),
  body('quantity').isNumeric().isFloat({ min: 0.1 }).withMessage('Quantity must be greater than 0'),
  body('deliveryAddress').isObject().withMessage('Delivery address is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { produceId, quantity, deliveryAddress, notes, paymentMethod = 'cash_on_delivery' } = req.body;

    // Find the produce
    const produce = await Produce.findById(produceId).populate('farmer');
    if (!produce) {
      return res.status(404).json({ message: 'Produce not found' });
    }

    // Check availability
    if (produce.quantity.available < quantity) {
      return res.status(400).json({ 
        message: `Only ${produce.quantity.available} ${produce.quantity.unit} available` 
      });
    }

    // Calculate total amount
    const totalAmount = quantity * produce.price.amount;

    // Create order
    const order = new Order({
      buyer: req.user._id,
      farmer: produce.farmer._id,
      produce: produceId,
      orderDetails: {
        cropName: produce.cropName,
        quantity: {
          ordered: quantity,
          unit: produce.quantity.unit
        },
        pricePerUnit: produce.price.amount,
        totalAmount
      },
      deliveryAddress,
      paymentMethod,
      notes: {
        buyer: notes
      }
    });

    await order.save();

    // Update produce availability
    produce.quantity.available -= quantity;
    await produce.save();

    // Create notification for farmer
    await createNotification(
      produce.farmer._id,
      req.user._id,
      'order_placed',
      'New Order Received',
      `${req.user.name} placed an order for ${quantity} ${produce.quantity.unit} of ${produce.cropName}`,
      order._id
    );

    const populatedOrder = await Order.findById(order._id)
      .populate('buyer', 'name phone')
      .populate('farmer', 'name phone')
      .populate('produce', 'cropName images');

    res.status(201).json({
      message: 'Order placed successfully',
      order: populatedOrder
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get buyer's orders
router.get('/buyer/my-orders', auth, buyerOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = { buyer: req.user._id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('farmer', 'name phone location')
      .populate('produce', 'cropName images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Fetch buyer orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get farmer's orders
router.get('/farmer/my-orders', auth, farmerOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = { farmer: req.user._id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('buyer', 'name phone location')
      .populate('produce', 'cropName images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Fetch farmer orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (farmers only)
router.put('/:id/status', auth, farmerOnly, [
  body('status').isIn(['accepted', 'rejected', 'dispatched', 'delivered']).withMessage('Invalid status'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, note } = req.body;
    const order = await Order.findById(req.params.id).populate('buyer').populate('produce');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if farmer owns this order
    if (order.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update order status
    order.status = status;
    if (note) {
      order.notes.farmer = note;
    }

    await order.save();

    // If order is rejected, restore produce quantity
    if (status === 'rejected') {
      const produce = await Produce.findById(order.produce._id);
      if (produce) {
        produce.quantity.available += order.orderDetails.quantity.ordered;
        await produce.save();
      }
    }

    // Create notification for buyer
    const statusMessages = {
      accepted: 'Your order has been accepted by the farmer',
      rejected: 'Your order has been rejected',
      dispatched: 'Your order has been dispatched',
      delivered: 'Your order has been delivered'
    };

    await createNotification(
      order.buyer._id,
      req.user._id,
      `order_${status}`,
      `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      statusMessages[status],
      order._id
    );

    const updatedOrder = await Order.findById(order._id)
      .populate('buyer', 'name phone')
      .populate('farmer', 'name phone')
      .populate('produce', 'cropName images');

    res.json({
      message: `Order ${status} successfully`,
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order details
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name phone location')
      .populate('farmer', 'name phone location')
      .populate('produce', 'cropName images description');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has access to this order
    const isOwner = order.buyer._id.toString() === req.user._id.toString() || 
                   order.farmer._id.toString() === req.user._id.toString();

    if (!isOwner) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Fetch order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order statistics for farmer dashboard
router.get('/farmer/stats', auth, farmerOnly, async (req, res) => {
  try {
    const farmerId = req.user._id;

    // Get order statistics
    const totalOrders = await Order.countDocuments({ farmer: farmerId });
    const pendingOrders = await Order.countDocuments({ farmer: farmerId, status: 'pending' });
    const acceptedOrders = await Order.countDocuments({ farmer: farmerId, status: 'accepted' });
    const completedOrders = await Order.countDocuments({ farmer: farmerId, status: 'delivered' });

    // Calculate total earnings
    const earningsResult = await Order.aggregate([
      { $match: { farmer: farmerId, status: { $in: ['accepted', 'dispatched', 'delivered'] } } },
      { $group: { _id: null, totalEarnings: { $sum: '$orderDetails.totalAmount' } } }
    ]);

    const totalEarnings = earningsResult.length > 0 ? earningsResult[0].totalEarnings : 0;

    // Get recent orders
    const recentOrders = await Order.find({ farmer: farmerId })
      .populate('buyer', 'name phone')
      .populate('produce', 'cropName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalOrders,
        pendingOrders,
        acceptedOrders,
        completedOrders,
        totalEarnings
      },
      recentOrders
    });
  } catch (error) {
    console.error('Fetch farmer stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;