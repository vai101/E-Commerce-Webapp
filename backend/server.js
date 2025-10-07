const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const asyncHandler = require('express-async-handler'); // Needed for custom middleware error handling

// Load environment variables
dotenv.config();

// === ROUTE IMPORTS ===
// NOTE: Ensure these files exist in backend/routes/
const userRoutes = require('./routes/userRoutes'); 
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes'); 
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
// =====================

// === ERROR HANDLING MIDDLEWARE ===
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
// ===================================


const app = express();

// === MIDDLEWARE SETUP ===
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', process.env.FRONTEND_URL],
    credentials: true, 
}));

app.get('/', (req, res) => {
  res.send('E-commerce API is running...');
});
// ==========================


// === DATABASE CONNECTION FUNCTION (MISSING PIECE) ===
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Crash the server if database connection fails (critical failure)
    process.exit(1); 
  }
};

// Execute the database connection
connectDB();
// ====================================================


// === ROUTE DEFINITIONS ===
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
// =========================


// === ERROR HANDLING (MUST BE LAST) ===
app.use(notFound);
app.use(errorHandler);
// =====================================


// === START SERVER (MISSING PIECE) ===
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => 
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);