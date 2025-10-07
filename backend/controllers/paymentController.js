// backend/controllers/paymentController.js (UPDATED)
const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto'); // Built-in Node module for signature verification
// Import the order creation logic from Phase 6
const { createOrderAndDeductInventory } = require('./orderController'); 

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
    // Note: Amount should be in paise (the smallest currency unit)
    const { amount, currency = 'INR', receiptId } = req.body;

    const options = {
        amount: amount, 
        currency: currency,
        receipt: receiptId || `receipt_order_${Date.now()}`,
        payment_capture: 1 // Auto capture the payment
    };

    try {
        const razorpayOrder = await razorpay.orders.create(options);
        
        // Return the Order ID and other necessary info to the frontend
        res.json({
            id: razorpayOrder.id,
            currency: razorpayOrder.currency,
            amount: razorpayOrder.amount,
            key_id: process.env.RAZORPAY_KEY_ID // Send the public key to the client
        });
    } catch (error) {
        console.error('Razorpay Order Creation Error:', error);
        res.status(500);
        throw new Error('Failed to create Razorpay Order');
    }
});

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/verify-payment
// @access  Private (Called from frontend after successful payment)
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
    // Data sent from the frontend after successful payment on Razorpay's side
    const { orderId, paymentId, signature, orderDetails } = req.body; 

    // 1. Generate the expected signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${orderId}|${paymentId}`);
    const digest = shasum.digest('hex');

    // 2. Compare the generated signature with the received signature
    if (digest !== signature) {
        res.status(400);
        throw new Error('Payment verification failed. Signatures do not match.');
    }
    
    // 3. Signature verification passed: Payment is genuine.
    
    // TEMPORARY: Assuming orderDetails contains the data needed for order creation
    // In a real app, you would fetch the OrderDetails based on orderId from a temp DB store.
    
    // Finalize the order and deduct inventory
    const finalOrderPayload = {
        orderItems: orderDetails.items, // Example of order data
        shippingAddress: orderDetails.shippingAddress, 
        paymentMethod: 'Razorpay',
        totalPrice: orderDetails.totalPrice,
        userId: req.user._id,
        paymentResult: { id: paymentId, status: 'paid', update_time: Date.now() }
    };

    // This function handles the complex logic (Phase 6)
    await createOrderAndDeductInventory(finalOrderPayload);
    
    res.json({ message: 'Payment verified and Order placed successfully!' });
});

module.exports = { createRazorpayOrder, verifyRazorpayPayment };