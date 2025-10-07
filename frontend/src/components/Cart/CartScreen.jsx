// src/components/Cart/CartScreen.jsx (Updated)
import React, { useState, useEffect } from 'react';
import apiClient from '../../api/api';
import { Link, useNavigate } from 'react-router-dom';

const CartScreen = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [editingQtyByProduct, setEditingQtyByProduct] = useState({}); // { [productId]: number }

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const { data } = await apiClient.get('/cart');
                setCart(data);
            } catch (err) {
                setError('Please log in to view your cart.');
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    const calculateTotal = () => {
        if (!cart) return '0.00';
        return cart.items.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);
    };

    const getProductId = (item) => item.product?._id || item.product;

    const startEditQty = (item) => {
        const id = getProductId(item);
        setEditingQtyByProduct((prev) => ({ ...prev, [id]: item.qty }));
    };

    const changeEditQty = (item, delta) => {
        const id = getProductId(item);
        setEditingQtyByProduct((prev) => {
            const next = Math.max(0, (prev[id] ?? item.qty) + delta);
            return { ...prev, [id]: next };
        });
    };

    const updateQty = async (item) => {
        const id = getProductId(item);
        const newQty = editingQtyByProduct[id];
        if (newQty === item.qty) return;
        try {
            await apiClient.post('/cart', { productId: id, qty: newQty });
            // Refresh cart
            const { data } = await apiClient.get('/cart');
            setCart(data);
            setEditingQtyByProduct((prev) => {
                const clone = { ...prev };
                delete clone[id];
                return clone;
            });
        } catch (e) {
            alert(e.response?.data?.message || 'Failed to update quantity');
        }
    };

    if (loading) return <h2 className="text-center text-white py-10 animate-fadeIn">Loading Cart...</h2>;
    if (error) return <h2 className="text-center text-red-500 py-10">{error}</h2>;
    if (!cart || cart.items.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl text-gray-300">Your cart is empty.</h2>
                <Link to="/" className="mt-4 inline-block px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                    Go Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 animate-fadeIn">
            <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item) => (
                        <div key={getProductId(item)} className="flex items-center p-4 bg-gray-800 rounded-lg shadow-md animate-slideUp">
                            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-6"/>
                            <div className="flex-grow">
                                <Link to={`/product/${getProductId(item)}`} className="font-semibold text-lg text-white hover:underline">{item.name}</Link>
                                {editingQtyByProduct[getProductId(item)] === undefined ? (
                                    <div className="mt-1 text-sm text-gray-400">Qty: {item.qty}</div>
                                ) : (
                                    <div className="mt-2 flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => changeEditQty(item, -1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            aria-label="Decrease quantity"
                                        >
                                            −
                                        </button>
                                        <div className="min-w-[1.75rem] text-center text-white font-semibold">
                                            {editingQtyByProduct[getProductId(item)]}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => changeEditQty(item, 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            aria-label="Increase quantity"
                                        >
                                            +
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateQty(item)}
                                            className="ml-2 px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:animate-pop"
                                        >
                                            Update
                                        </button>
                                    </div>
                                )}
                                {editingQtyByProduct[getProductId(item)] === undefined && (
                                    <button
                                        onClick={() => startEditQty(item)}
                                        className="text-yellow-400 hover:text-yellow-300 text-sm mt-2 font-semibold"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-xl text-white">₹{(item.qty * item.price).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cart Summary Card */}
                <div className="bg-gray-800 rounded-lg shadow-md p-6 h-fit animate-slideUp">
                    <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-4 mb-4">
                        Order Summary
                    </h2>
                    <div className="flex justify-between text-gray-300 mb-2">
                        <span>Subtotal ({cart.items.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                        <span>₹{calculateTotal()}</span>
                    </div>
                    {/* Add shipping, taxes etc. here if needed */}
                    <div className="flex justify-between font-bold text-white text-xl mt-6 pt-4 border-t border-gray-700">
                        <span>Total</span>
                        <span>₹{calculateTotal()}</span>
                    </div>
                    <button onClick={() => navigate('/checkout')} className="w-full mt-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartScreen;