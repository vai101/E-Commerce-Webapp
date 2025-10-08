import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import apiClient from '../../api/api';
import { Link } from 'react-router-dom';

const HomeScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await apiClient.get('/products');
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch products.');
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (error) return <h2 className="text-center text-red-600 dark:text-red-400 py-10">{error}</h2>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fadeIn">
      {/* Hero Heading */}
      <section className="text-center mb-10 sm:mb-12 lg:mb-14">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-600 bg-clip-text text-transparent animate-slideUp opacity-0" style={{ animationDelay: '0s' }}>
          E - Commerce
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 animate-slideUp opacity-0" style={{ animationDelay: '1s' }}>
          Discover pre-loved gems at delightful prices — sustainable style, delivered to you.
        </p>
      </section>

      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Latest Products</h2>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products yet</h2>
          <p className="text-gray-600 dark:text-gray-400">Check back soon for new arrivals.</p>
          <div className="mt-6">
            <Link to="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Refresh</Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeScreen;