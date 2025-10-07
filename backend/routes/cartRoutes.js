// backend/routes/cartRoutes.js
const express = require('express');
const { getCart, addItemToCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Cart operations require the user to be logged in
router.route('/')
    .get(protect, getCart)
    .post(protect, addItemToCart);

module.exports = router;