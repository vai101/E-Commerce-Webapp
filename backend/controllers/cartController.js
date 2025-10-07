// backend/controllers/cartController.js (Simplified)
const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (cart) {
        res.json(cart);
    } else {
        // Return an empty cart if none exists
        res.json({ user: req.user._id, items: [] });
    }
});

// @desc    Add item to cart or update quantity
// @route   POST /api/cart
// @access  Private
const addItemToCart = asyncHandler(async (req, res) => {
    const { productId, qty } = req.body;
    const product = await Product.findById(productId);

    if (!product || product.stock < qty) {
        res.status(404);
        throw new Error('Product not found or insufficient stock.');
    }

    const item = {
        product: productId,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: qty,
    };

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        // Create new cart
        cart = await Cart.create({ user: req.user._id, items: [item] });
    } else {
        const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);

        if (itemIndex > -1) {
            // Update quantity if item exists
            cart.items[itemIndex].qty = qty;
        } else {
            // Add new item
            cart.items.push(item);
        }
        await cart.save();
    }
    res.status(201).json(cart);
});

// TODO: Implement removeItemFromCart function

module.exports = { getCart, addItemToCart };