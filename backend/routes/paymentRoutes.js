// backend/routes/paymentRoutes.js (CLEANED VERSION - RAZORPAY)

const express = require('express');
const { 
    createRazorpayOrder, 
    verifyRazorpayPayment 
} = require('../controllers/paymentController'); // Import Razorpay controllers
const { protect } = require('../middleware/authMiddleware');
// const asyncHandler = require('express-async-handler'); // REMOVED - It's used in the controller, not here.

const router = express.Router();

// 1. PROTECTED ROUTE: Frontend requests a new Razorpay Order ID from the backend
// Access: Private (Requires JWT/Bearer token)
router.post('/create-order', protect, createRazorpayOrder);

// 2. PROTECTED ROUTE: Frontend submits the payment success details 
// for backend signature verification.
// Access: Private (Requires JWT/Bearer token)
router.post('/verify-payment', protect, verifyRazorpayPayment);

module.exports = router;