// backend/models/productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    image: { type: String, required: true }, // Simple URL string for image hosting
    category: { type: String, required: true },
    brand: { type: String },
    // CRITICAL: Stock/Inventory tracking
    stock: { type: Number, required: true, default: 0, min: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    // Optional: Reference to the user who created it (e.g., admin)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;