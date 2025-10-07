// backend/routes/productRoutes.js
const express = require('express');
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware'); // Import auth middleware
const { searchProducts } = require('../controllers/productController');
const router = express.Router();

// Public Routes
router.route('/').get(getProducts);
router.route('/search').get(searchProducts);
router.route('/:id').get(getProductById);

// Admin Routes (Protected by both 'protect' and 'admin' middleware)
router.route('/').post(protect, admin, createProduct);
router.route('/:id').put(protect, admin, updateProduct);

module.exports = router;