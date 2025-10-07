// backend/routes/orderRoutes.js
const express = require('express');
const { getOrders, updateOrderToDelivered } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Admin-only route: View all orders
router.route('/').get(protect, admin, getOrders);

// Admin-only route: Mark order as delivered
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;