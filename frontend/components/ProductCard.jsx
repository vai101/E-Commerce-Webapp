const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Load environment variables from .env file
dotenv.config();

// === ROUTE IMPORTS ===
const userRoutes = require('./routes/userRoutes'); 
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes'); 
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// === ERROR HANDLER IMPORTS ===
const { notFound, errorHandler } = require('./middleware/errorMiddleware'); // Assuming you move these to a file

// --- 1. INITIALIZE APP & DATABASE CONNECTION ---
const app = express();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); 
  }
};
connectDB();

// --- 2. MIDDLEWARE SETUP ---
// Enable CORS with specific options
app.use(cors({
    origin: [
        'http://localhost:5173', // For local dev
        process.env.FRONTEND_URL,
        'https://e-commerce-webapp-mu.vercel.app' // Your Vercel URL
    ],
    credentials: true, 
}));
app.use(express.json()); // Body parser for JSON
app.use(cookieParser()); // Parser for cookies
app.use(helmet()); // Basic security headers

// --- 3. API ROUTES ---
app.get('/', (req, res) => {
  res.send('E-commerce API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes); // This line makes your payment routes work

// --- 4. CUSTOM ERROR HANDLING (must be last) ---
app.use(notFound);
app.use(errorHandler);

// --- 5. START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);

// Frontend code example (React/JSX) for rendering product image
// <img src={product.image} alt={product.name} />