import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomeScreen from './components/Product/HomeScreen';
import ProductScreen from './components/Product/ProductScreen';
import LoginScreen from './components/Auth/LoginScreen'; 
import RegisterScreen from './components/Auth/RegisterScreen'; 
import VerifyEmailScreen from './components/Auth/VerifyEmailScreen';
import CartScreen from './components/Cart/CartScreen';
import CheckoutScreen from './components/Payment/CheckoutScreen';
import Header from './components/Layout/Header';
import AdminCreateProduct from './components/Product/AdminCreateProduct';
import './App.css';

const Footer = () => (
    <footer className="app-footer"> 
        <div>
            &copy; 2025 Vaibhav Anand | Designed for Scale and Security
        </div>
    </footer>
);


function App() {
  return (
    <Router>
      <Header />
      <main className="app-main">
        <Routes>
      
          <Route path="/" element={<HomeScreen />} exact />
          <Route path="/product/:id" element={<ProductScreen />} />
          
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/verify-email/:token" element={<VerifyEmailScreen />} />
          
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/checkout" element={<CheckoutScreen />} />
          
          <Route path="/admin/products/new" element={<AdminCreateProduct />} />
          
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;