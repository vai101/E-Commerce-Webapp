const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto'); 

const { createOrderAndDeductInventory } = require('./orderController'); 

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = asyncHandler(async (req, res) => {

    const { amount, currency = 'INR', receiptId } = req.body;

    const options = {
        amount: amount, 
        currency: currency,
        receipt: receiptId || `receipt_order_${Date.now()}`,
        payment_capture: 1 
    };

    try {
        const razorpayOrder = await razorpay.orders.create(options);
        
        res.json({
            id: razorpayOrder.id,
            currency: razorpayOrder.currency,
            amount: razorpayOrder.amount,
            key_id: process.env.RAZORPAY_KEY_ID 
        });
    } catch (error) {
        console.error('Razorpay Order Creation Error:', error);
        res.status(500);
        throw new Error('Failed to create Razorpay Order');
    }
});

const verifyRazorpayPayment = asyncHandler(async (req, res) => {

    const { orderId, paymentId, signature, orderDetails } = req.body; 

   
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${orderId}|${paymentId}`);
    const digest = shasum.digest('hex');

    if (digest !== signature) {
        res.status(400);
        throw new Error('Payment verification failed. Signatures do not match.');
    }
    
    const finalOrderPayload = {
        orderItems: orderDetails.items, 
        shippingAddress: orderDetails.shippingAddress, 
        paymentMethod: 'Razorpay',
        totalPrice: orderDetails.totalPrice,
        userId: req.user._id,
        paymentResult: { id: paymentId, status: 'paid', update_time: Date.now() }
    };

    await createOrderAndDeductInventory(finalOrderPayload);
    
    res.json({ message: 'Payment verified and Order placed successfully!' });
});

module.exports = { createRazorpayOrder, verifyRazorpayPayment };