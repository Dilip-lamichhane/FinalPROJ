const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize, isShopOwner } = require('../middleware/auth');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock,
  getProductsByShop
} = require('../controllers/productController');

const router = express.Router();

// Product validation rules
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Product name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('shop')
    .isMongoId()
    .withMessage('Valid shop ID is required'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('images.*.url')
    .optional()
    .isURL()
    .withMessage('Each image must have a valid URL'),
  body('images.*.alt')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Image alt text cannot exceed 100 characters')
];

// Stock validation
const stockValidation = [
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
];

// Public routes
router.get('/', getProducts);
router.get('/shop/:shopId', getProductsByShop);
router.get('/:id', getProductById);

// Protected routes - Shopkeeper/Admin only
router.post('/', authenticate, authorize('shopkeeper', 'admin'), productValidation, createProduct);
router.put('/:id', authenticate, authorize('shopkeeper', 'admin'), productValidation, updateProduct);
router.delete('/:id', authenticate, authorize('shopkeeper', 'admin'), deleteProduct);
router.patch('/:id/stock', authenticate, authorize('shopkeeper', 'admin'), stockValidation, updateStock);

module.exports = router;