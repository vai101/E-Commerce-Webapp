// backend/controllers/orderController.js (For Internal Logic)
const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel'); // We will clear the cart after order

// Logic for creating the order and updating inventory
const createOrderAndDeductInventory = async (payload) => {
    // 1. Extract necessary data from the payload (e.g., from client side when payment intent was created)
    const { orderItems, shippingAddress, paymentMethod, totalPrice, userId } = payload;

    // 2. Create the Order
    const order = new Order({
        user: userId,
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
        isPaid: true,
        paidAt: Date.now(),
        // Payment result populated by the webhook later
    });

    const createdOrder = await order.save();

    // 3. CRITICAL: Deduct Inventory
    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
            product.stock -= item.qty;
            await product.save();
        }
    }

    // 4. Clear the User's Cart
    await Cart.deleteOne({ user: userId });

    return createdOrder;
};

const getOrders = asyncHandler(async (req, res) => {
    // Populate user details, but only name and ID
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});

// @desc    Update order to Delivered (Admin only)
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// ... (Other functions like getOrderById, getUserOrders)
module.exports = { createOrderAndDeductInventory,
    getOrders, // NEW
    updateOrderToDelivered
 };