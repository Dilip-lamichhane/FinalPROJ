const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  response: {
    type: String,
    trim: true,
    maxlength: 500
  },
  responseBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  responseAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one review per user per shop
reviewSchema.index({ shop: 1, author: 1 }, { unique: true });

// Index for efficient shop review queries
reviewSchema.index({ shop: 1, isActive: 1, createdAt: -1 });

// Update shop rating after review save/update/delete
reviewSchema.post('save', async function() {
  await this.constructor.updateShopRating(this.shop);
});

reviewSchema.post('findOneAndUpdate', async function() {
  if (this.shop) {
    await this.constructor.updateShopRating(this.shop);
  }
});

reviewSchema.post('findOneAndDelete', async function() {
  if (this.shop) {
    await this.constructor.updateShopRating(this.shop);
  }
});

// Static method to update shop rating
reviewSchema.statics.updateShopRating = async function(shopId) {
  const stats = await this.aggregate([
    { $match: { shop: shopId, isActive: true } },
    { $group: { _id: '$shop', averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }
  ]);
  
  const Shop = mongoose.model('Shop');
  if (stats.length > 0) {
    await Shop.findByIdAndUpdate(shopId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].reviewCount
    });
  } else {
    await Shop.findByIdAndUpdate(shopId, { averageRating: 0, reviewCount: 0 });
  }
};

// Update updatedAt timestamp
reviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Review', reviewSchema);