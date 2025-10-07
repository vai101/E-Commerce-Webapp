// src/components/Product/ProductScreen.jsx (Updated)
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
            // Consider a more user-friendly modal or redirect with state
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
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Product Image */}
                <div>
                    <img src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg" />
                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">{product.name}</h1>
                    <p className="text-3xl font-semibold text-blue-400 mb-4">₹{product.price.toFixed(2)}</p>
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
                                <label htmlFor="qty" className="text-lg font-medium text-gray-300">Quantity:</label>
                                <select 
                                    id="qty" 
                                    value={qty} 
                                    onChange={(e) => setQty(Number(e.target.value))}
                                    className="bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {[...Array(product.stock).keys()].slice(0, 10).map((x) => ( // Limiting to 10 for UI sanity
                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={addToCartHandler} 
                        disabled={product.stock === 0}
                        className="w-full mt-6 py-3 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductScreen;