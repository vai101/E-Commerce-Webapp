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

    if (!product) {
        res.status(404);
        throw new Error('Product not found.');
    }

    // If qty is 0 or less, remove item from cart if present
    let cart = await Cart.findOne({ user: req.user._id });
    if (qty <= 0) {
        if (!cart) {
            return res.status(200).json({ user: req.user._id, items: [] });
        }
        const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items.splice(itemIndex, 1);
            await cart.save();
        }
        return res.status(200).json(cart);
    }

    if (product.stock < qty) {
        res.status(400);
        throw new Error('Insufficient stock.');
    }

    const item = {
        product: productId,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: qty,
    };

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [item] });
    } else {
        const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].qty = qty;
        } else {
            cart.items.push(item);
        }
        await cart.save();
    }
    res.status(201).json(cart);
});

// TODO: Implement removeItemFromCart function

module.exports = { getCart, addItemToCart };