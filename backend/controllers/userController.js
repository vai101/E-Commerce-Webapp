const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler'); 
const sendVerificationEmail = require('../utils/sendEmail');

const generateTokens = (id, role) => {
  
    const accessToken = jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN, 
    });

    const refreshToken = jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN, 
    });

    return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({ name, email, password });

    if (user) {
        try {
            const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
            await sendVerificationEmail(user, verificationUrl);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                message: 'Registration successful. A verification link has been sent to your email.'
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            res.status(500).json({ message: 'Registration successful, but failed to send verification email.' });
        }
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

 
    if (user && (await user.matchPassword(password))) {

        
        if (!user.isVerified) {
            res.status(401);
            throw new Error('Account not verified. Please check your email.');
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        if (adminEmail) {
            if (user.email === adminEmail && user.role !== 'admin') {
                user.role = 'admin';
                await user.save();
            } else if (user.email !== adminEmail && user.role === 'admin') {
                user.role = 'user';
                await user.save();
            }
        }

        const { accessToken, refreshToken } = generateTokens(user._id, user.role);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken, 
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    try {
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404);
            throw new Error('User not found.');
        }

        if (user.isVerified) {
            return res.status(200).json({ message: 'Email already verified. You can now login.' });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: 'Email successfully verified. You can now login.' });

    } catch (error) {
        res.status(400);
        throw new Error('Verification link is invalid or has expired.');
    }
});

module.exports = { registerUser, loginUser, verifyEmail};
