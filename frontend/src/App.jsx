import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom'; 

// Component Imports
import HomeScreen from './components/Product/HomeScreen';
import ProductScreen from './components/Product/ProductScreen';
import LoginScreen from './components/Auth/LoginScreen'; // Corrected Path
import RegisterScreen from './components/Auth/RegisterScreen'; // Assuming you created this
import VerifyEmailScreen from './components/Auth/VerifyEmailScreen'; // Corrected Path
import CartScreen from './components/Cart/CartScreen';
import CheckoutScreen from './components/Payment/CheckoutScreen';
import './App.css';

// Helper Components (Keeping Header/Footer simple here for flow)
const Header = () => (
    <header className="app-header"> {/* <-- Use className */}
        <Link to="/"><strong>Ecom Store</strong></Link> {/* Make logo bold */}
        <nav>
            <Link to="/cart">Cart</Link>
            <Link to="/login">Sign In</Link>
        </nav>
    </header>
);

const Footer = () => (
    <footer className="app-footer"> {/* <-- Use className */}
        <div>
            &copy; 2025 MERN Ecom | Designed for Scale and Security
        </div>
    </footer>
);


function App() {
  return (
    <Router>
      <Header />
      <main className="app-main">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeScreen />} exact />
          <Route path="/product/:id" element={<ProductScreen />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/verify-email/:token" element={<VerifyEmailScreen />} />
          
          {/* Private E-commerce Routes */}
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/checkout" element={<CheckoutScreen />} />
          
          {/* Admin Routes - Requires implementation */}
          {/* <Route path="/admin/orders" element={<AdminOrderScreen />} /> */}
          
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;