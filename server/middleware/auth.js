const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

const farmerOnly = (req, res, next) => {
  if (req.user.userType !== 'farmer') {
    return res.status(403).json({ message: 'Access denied. Farmers only.' });
  }
  next();
};

const buyerOnly = (req, res, next) => {
  if (req.user.userType !== 'buyer') {
    return res.status(403).json({ message: 'Access denied. Buyers only.' });
  }
  next();
};

module.exports = { auth, farmerOnly, buyerOnly };