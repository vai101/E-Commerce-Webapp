// backend/controllers/userController.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler'); // Helper for handling express async errors
const sendVerificationEmail = require('../utils/sendEmail');

// Helper function to generate JWTs
const generateTokens = (id, role) => {
    // Access Token (Short-lived, sent with every request)
    const accessToken = jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN, // Should be '15m'
    });

    // Refresh Token (Long-lived, used only for generating new access tokens)
    const refreshToken = jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN, // Should be '7d'
    });

    return { accessToken, refreshToken };
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({ name, email, password });

    if (user) {
        // **********************************************
        // * NEW: Send the verification email immediately *
        // **********************************************
        try {
            await sendVerificationEmail(user);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                message: 'Registration successful. A verification link has been sent to your email.'
            });
        } catch (emailError) {
            // Log error but don't fail the registration; notify user if possible
            console.error('Email sending failed:', emailError);
            res.status(500).json({ message: 'Registration successful, but failed to send verification email.' });
        }
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Auth user & get tokens
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {

        // Enforce email verification check
        if (!user.isVerified) {
            res.status(401);
            throw new Error('Account not verified. Please check your email.');
        }

        const { accessToken, refreshToken } = generateTokens(user._id, user.role);

        // Set refresh token in HTTP-only cookie (Crucial Security Step)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // Prevents client-side JS access
            secure: process.env.NODE_ENV === 'production', // Use secure in production
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days (Matches token expiration)
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken, // Send Access Token back to client (store in memory)
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// TODO: refresh token logic goes here in Phase 3

const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    try {
        // 1. Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // 2. Find the user and update isVerified status
        const user = await User.findById(userId);

        if (!user) {
            res.status(404);
            throw new Error('User not found.');
        }

        if (user.isVerified) {
            // Already verified, no action needed but success response
            return res.status(200).json({ message: 'Email already verified. You can now login.' });
        }

        user.isVerified = true;
        await user.save();

        // 3. Optional: Redirect to a success page on the frontend
        // In a real app, you might redirect to the login page or a success message page.
        // For API, we just send a success message.
        res.status(200).json({ message: 'Email successfully verified. You can now login.' });

    } catch (error) {
        // Token is invalid (expired, corrupted, etc.)
        res.status(400);
        throw new Error('Verification link is invalid or has expired.');
    }
});

module.exports = { registerUser, loginUser, verifyEmail};
