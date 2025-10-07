// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Middleware to protect routes (ensure user is logged in)
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header (Format: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify token and get user ID/Role
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user (without password) and attach to request object
            req.user = await User.findById(decoded.id).select('-password');
            req.userRole = decoded.role; // Attach the role for convenience

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed or expired');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// Middleware to restrict access based on user role
const admin = (req, res, next) => {
    // Check the role attached by the 'protect' middleware
    if (req.user && req.userRole === 'admin') {
        next();
    } else {
        res.status(403); // Forbidden
        throw new Error('Not authorized as an admin');
    }
};

module.exports = { protect, admin };