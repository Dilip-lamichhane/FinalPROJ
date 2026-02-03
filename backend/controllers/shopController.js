const Shop = require('../models/Shop');
const User = require('../models/User');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { validationResult } = require('express-validator');

// Create a new shop
const createShop = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, category, location, address, contact, businessHours } = req.body;

    // Validate coordinates
    if (!location || !location.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({ error: 'Valid location coordinates are required' });
    }

    const shop = new Shop({
      owner: req.user._id,
      name,
      description,
      category,
      location: {
        type: 'Point',
        coordinates: location.coordinates
      },
      address,
      contact,
      businessHours
    });

    await shop.save();
    await shop.populate('owner', 'username email');
    await shop.populate('category', 'name');

    res.status(201).json({
      message: 'Shop created successfully',
      shop
    });
  } catch (error) {
    console.error('Create shop error:', error);
    res.status(500).json({ error: 'Failed to create shop' });
  }
};

// Search shops with geospatial queries
const searchShops = async (req, res) => {
  try {
    const { lat, lng, radius = 10, category, minRating = 0, page = 1, limit = 20 } = req.query;

    // Build query
    let query = { isActive: true };

    // Geospatial search
    if (lat && lng) {
      query.location = {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], radius / 6378.1] // Convert km to radians
        }
      };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Rating filter
    if (minRating > 0) {
      query.averageRating = { $gte: parseFloat(minRating) };
    }

    const shops = await Shop.find(query)
      .populate('owner', 'username email')
      .populate('category', 'name color')
      .sort({ averageRating: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Shop.countDocuments(query);

    res.json({
      shops,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Search shops error:', error);
    res.status(500).json({ error: 'Failed to search shops' });
  }
};

// Get shop details with products and reviews
const getShopDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findOne({ _id: id, isActive: true })
      .populate('owner', 'username email')
      .populate('category', 'name color');

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    // Get products
    const products = await Product.find({ shop: id, isActive: true })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    // Get reviews with pagination
    const { page = 1, limit = 10 } = req.query;
    const reviews = await Review.find({ shop: id, isActive: true })
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const totalReviews = await Review.countDocuments({ shop: id, isActive: true });

    res.json({
      shop,
      products,
      reviews: {
        data: reviews,
        totalPages: Math.ceil(totalReviews / limit),
        currentPage: parseInt(page),
        total: totalReviews
      }
    });
  } catch (error) {
    console.error('Get shop details error:', error);
    res.status(500).json({ error: 'Failed to get shop details' });
  }
};

// Update shop
const updateShop = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const shop = await Shop.findOne({ _id: id, owner: req.user._id, isActive: true });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found or you are not the owner' });
    }

    const allowedUpdates = ['name', 'description', 'address', 'contact', 'businessHours', 'logoUrl'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    Object.assign(shop, updates);
    await shop.save();
    await shop.populate('owner', 'username email');
    await shop.populate('category', 'name');

    res.json({
      message: 'Shop updated successfully',
      shop
    });
  } catch (error) {
    console.error('Update shop error:', error);
    res.status(500).json({ error: 'Failed to update shop' });
  }
};

// Delete shop (soft delete)
const deleteShop = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findOne({ _id: id, owner: req.user._id, isActive: true });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found or you are not the owner' });
    }

    // Soft delete shop and related products
    shop.isActive = false;
    await shop.save();

    // Soft delete all products in this shop
    await Product.updateMany({ shop: id }, { isActive: false });

    res.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    console.error('Delete shop error:', error);
    res.status(500).json({ error: 'Failed to delete shop' });
  }
};

module.exports = {
  createShop,
  searchShops,
  getShopDetails,
  updateShop,
  deleteShop
};