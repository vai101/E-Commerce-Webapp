const express = require('express');
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware'); 
const { searchProducts } = require('../controllers/productController');
const router = express.Router();

router.route('/').get(getProducts);
router.route('/search').get(searchProducts);
router.route('/:id').get(getProductById);

router.route('/').post(protect, admin, createProduct);
router.route('/:id').put(protect, admin, updateProduct);

module.exports = router;