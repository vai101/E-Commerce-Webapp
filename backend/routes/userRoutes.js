// backend/routes/userRoutes.js (Updated)
const express = require('express');
const { registerUser, loginUser, verifyEmail } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify-email/:token', verifyEmail); // New verification route

module.exports = router;