const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Clerk authentication sync endpoint
router.post('/clerk-sync', async (req, res) => {
  try {
    const { clerkId, email, username, firstName, lastName, role = 'customer' } = req.body;

    // Validate required fields
    if (!clerkId || !email || !username) {
      return res.status(400).json({ 
        error: 'Missing required fields: clerkId, email, and username are required' 
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // Update existing user with Clerk data
      user.clerkId = clerkId;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.username = username;
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user
      user = new User({
        clerkId,
        email,
        username,
        firstName: firstName || '',
        lastName: lastName || '',
        role,
        isActive: true,
        lastLogin: new Date()
      });
      await user.save();
    }

    // Generate JWT token for backend API access
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      },
      role: user.role
    });
  } catch (error) {
    console.error('Clerk sync error:', error);
    res.status(500).json({ 
      error: 'Failed to sync user with backend',
      details: error.message 
    });
  }
});

// Get current user (protected route)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user information' });
  }
});

// Update user profile (protected route)
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update allowed fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    await user.save();

    res.json({
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get all users (admin only)
router.get('/users', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const users = await User.find({ isActive: true }).select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

module.exports = router;