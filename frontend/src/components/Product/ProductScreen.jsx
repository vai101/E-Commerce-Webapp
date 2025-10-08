import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/api';
import { useAuth } from '../../context/AuthContext'; 

const ProductScreen = () => {
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await apiClient.get(`/products/${id}`);
                setProduct(data);
            } catch (err) {
                setError('Product not found.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

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
            alert('Failed to add to cart. Please try again.');
        }
    };

    if (loading) return <h2 className="text-center text-white py-10">Loading Product...</h2>;
    if (error) return <h2 className="text-center text-red-500 py-10">{error}</h2>;
    if (!product) return null;

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Product Image */}
                <div className="animate-slideUp">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-auto object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.015] bg-gray-100 dark:bg-gray-900"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/800x600/111827/9CA3AF?text=Image+Unavailable'; }}
                    />
                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-center animate-slideUp">
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">{product.name}</h1>
                    <div className="flex items-baseline justify-between mb-4">
                        <p className="text-3xl font-semibold text-blue-400">₹{product.price.toFixed(2)}</p>
                        <p className="text-xl font-bold text-white">Total: ₹{(product.price * qty).toFixed(2)}</p>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-6">{product.description}</p>
                    
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-medium text-gray-300">Status:</span>
                            <span className={`px-3 py-1 text-sm font-bold rounded-full ${product.stock > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>

                        {product.stock > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-medium text-gray-300">Quantity:</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                                        className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        aria-label="Decrease quantity"
                                    >
                                        −
                                    </button>
                                    <div className="min-w-[2rem] text-center text-white font-semibold" aria-live="polite">{qty}</div>
                                    <button
                                        type="button"
                                        onClick={() => setQty((q) => Math.min(Math.max(1, product.stock), q + 1))}
                                        className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={addToCartHandler} 
                        disabled={product.stock === 0}
                        className="w-full mt-6 py-3 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed active:animate-pop"
                    >
                        {product.stock > 0 ? `Add ${qty} to Cart • ₹${(product.price * qty).toFixed(2)}` : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductScreen;