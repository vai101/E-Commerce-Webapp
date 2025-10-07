import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/api';

const StarIcon = ({ filled }) => (
  <svg 
    className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} 
    fill="currentColor" 
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg 
    className={`w-5 h-5 ${filled ? 'text-red-500' : 'text-gray-400'}`} 
    fill={filled ? 'currentColor' : 'none'} 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
    />
  </svg>
);

const ShoppingCartIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m5.6 0L9 17m0 0a2 2 0 100 4 2 2 0 000-4m0 0h8m-8 0V9a2 2 0 100-4" />
  </svg>
);

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [qty, setQty] = useState(1);
  // Add to cart with qty 1 and redirect
  const addToCartHandler = async () => {
    if (!user) {
      alert('Please login to add items to your cart.');
      navigate('/login');
      return;
    }
    try {
      await apiClient.post('/cart', { productId: product._id, qty });
      navigate('/cart');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart.');
    }
  };

  const fallbackImg = 'https://placehold.co/600x400/111827/9CA3AF?text=Image+Unavailable';

  const safeSrc = (url) => {
    if (!url) return fallbackImg;
    if (/^https?:\/\//i.test(url)) return url;
    return `https://${url}`;
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 animate-slideUp">
      <Link to={`/product/${product._id}`} className="block relative">
        <img
          src={safeSrc(product.image)}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105 bg-gray-100 dark:bg-gray-900"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = fallbackImg; }}
        />
        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm">
          New
        </span>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">{product.category || 'Category'}</p>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 flex-grow line-clamp-2">
          <Link to={`/product/${product._id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {product.name}
          </Link>
        </h3>

        <div className="flex items-baseline justify-between mb-4">
          <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
            ₹{product.price.toFixed(2)}
          </p>
          {product.stock > 0 ? (
            <span className="text-xs font-medium text-green-600 dark:text-green-400">In stock</span>
          ) : (
            <span className="text-xs font-medium text-red-600 dark:text-red-400">Out of stock</span>
          )}
        </div>

        {product.stock > 0 && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">Qty</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <div className="min-w-[1.75rem] text-center text-gray-900 dark:text-white font-semibold" aria-live="polite">{qty}</div>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(Math.max(1, product.stock), q + 1))}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        )}

        <button
          onClick={addToCartHandler}
          disabled={product.stock === 0}
          className="w-full mt-auto py-2.5 px-4 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-gray-800 transition-colors"
        >
          {product.stock > 0 ? `Add ${qty} to Cart` : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;