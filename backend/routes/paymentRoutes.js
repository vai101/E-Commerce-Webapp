// backend/routes/paymentRoutes.js
const express = require('express');
const { 
    createRazorpayOrder, 
    verifyRazorpayPayment 
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to create a Razorpay order
router.post('/create-order', protect, createRazorpayOrder);

// Route for the frontend to submit payment details for verification
router.post('/verify-payment', protect, verifyRazorpayPayment);

module.exports = router;