const express = require('express');
const { getCart, addItemToCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getCart)
    .post(protect, addItemToCart);

module.exports = router;