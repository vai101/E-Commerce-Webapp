const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel'); 

const createOrderAndDeductInventory = async (payload) => {

    const { orderItems, shippingAddress, paymentMethod, totalPrice, userId } = payload;

    const order = new Order({
        user: userId,
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
        isPaid: true,
        paidAt: Date.now(),

    });

    const createdOrder = await order.save();

    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
            product.stock -= item.qty;
            await product.save();
        }
    }

    await Cart.deleteOne({ user: userId });

    return createdOrder;
};

const getOrders = asyncHandler(async (req, res) => {
  
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});

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

module.exports = { createOrderAndDeductInventory,
    getOrders,
    updateOrderToDelivered
 };