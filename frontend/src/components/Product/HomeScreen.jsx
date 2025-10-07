// frontend/src/components/Product/HomeScreen.jsx
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

    if (loading) return <h2>Loading Products...</h2>;
    if (error) return <h2 className="text-center text-red-500 py-10">{error}</h2>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Latest Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          // Show 8 skeletons while loading
          Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)
        ) : (
          // Show actual product cards when data is loaded
          products.map((product) => (
            <ProductCard key={product._id} product={product} /> 
          ))
        )}
      </div>
    </div>
  );
};

export default HomeScreen;