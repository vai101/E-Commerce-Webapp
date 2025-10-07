// backend/routes/paymentRoutes.js (UPDATED VERSION - RAZORPAY)

const express = require('express');
const { 
    createRazorpayOrder, 
    verifyRazorpayPayment 
} = require('../controllers/paymentController'); // Import Razorpay controllers
const { protect } = require('../middleware/authMiddleware');
const crypto = require('crypto'); // Import crypto for signature verification

const router = express.Router();

// 1. PROTECTED ROUTE: Frontend requests a new Razorpay Order ID from the backend
// Access: Private (Requires JWT/Bearer token)
router.post('/create-order', protect, createRazorpayOrder);

// 2. PROTECTED ROUTE: Frontend submits the payment success details 
// for backend signature verification.
// Access: Private (Requires JWT/Bearer token)
router.post('/verify-payment', protect, verifyRazorpayPayment);

// 3. PAYMENT VERIFICATION: Verify Razorpay payment signature
router.post('/verify', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Log incoming data for debugging
    console.log('Payment verification payload:', req.body);

    // Check for missing fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        console.error('Missing payment verification fields:', req.body);
        return res.status(400).json({ success: false, message: "Missing payment verification fields." });
    }

    const secret = process.env.RAZORPAY_SECRET;
    if (!secret) {
        console.error('RAZORPAY_SECRET not set in environment variables.');
        return res.status(500).json({ success: false, message: "Server configuration error: RAZORPAY_SECRET missing." });
    }

    const generated_signature = crypto
        .createHmac('sha256', secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');

    if (generated_signature === razorpay_signature) {
        // Payment verified successfully
        return res.status(200).json({ success: true, message: "Payment verified successfully." });
    } else {
        // Log error for debugging
        console.error('Payment verification failed:', {
            generated_signature,
            razorpay_signature,
            razorpay_order_id,
            razorpay_payment_id
        });
        return res.status(400).json({ success: false, message: "Payment verification failed." });
    }
});

module.exports = router;