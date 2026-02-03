const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.',
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};

const isOwnerOrAdmin = (resourceField = 'owner') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user is the owner of the resource
    const resourceOwner = req[resourceField] || req.body[resourceField] || req.params[resourceField];
    
    if (req.user.id !== resourceOwner && req.user._id !== resourceOwner) {
      return res.status(403).json({ 
        error: 'Access denied. You can only access your own resources.' 
      });
    }

    next();
  };
};

const isShopOwner = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (req.user.role === 'admin') {
      return next();
    }

    const { Shop } = require('../models');
    const shopId = req.params.shopId || req.body.shop || req.params.id;
    
    if (!shopId) {
      return res.status(400).json({ error: 'Shop ID is required.' });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found.' });
    }

    if (shop.owner.toString() !== req.user.id && req.user._id !== shop.owner.toString()) {
      return res.status(403).json({ 
        error: 'Access denied. You can only access your own shop.' 
      });
    }

    req.shop = shop;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authorization check failed.' });
  }
};

module.exports = { authorize, isOwnerOrAdmin, isShopOwner };