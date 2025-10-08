const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const userRoutes = require('./routes/userRoutes'); 
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes'); 
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware'); 

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

const corsOptions = {
    origin: 'https://e-commerce-webapp-mu.vercel.app',
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); 
app.use(helmet()); 
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('E-commerce API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes); 

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);