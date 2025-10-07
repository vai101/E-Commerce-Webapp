// frontend/src/components/Payment/CheckoutScreen.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../../api/api';
import loadRazorpayScript from '../../utils/loadRazorpayScript';
import { useAuth } from '../../context/AuthContext'; 

const CheckoutScreen = () => {
    const { user } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shippingAddress, setShippingAddress] = useState('123 Main St, Mumbai'); // Simplified for demo

    useEffect(() => {
        const fetchCart = async () => {
            const { data } = await apiClient.get('/cart');
            setCart(data);
            setLoading(false);
        };
        fetchCart();
    }, []);

    const displayRazorpay = async () => {
        if (!cart || cart.items.length === 0) return alert("Cart is empty.");

        const totalAmountPaise = Math.round(cart.items.reduce((acc, item) => acc + item.qty * item.price, 0) * 100);

        // 1. Backend Call: Get Razorpay Order ID
        const { data: { id, currency, amount, key_id } } = await apiClient.post('/payment/create-order', {
            amount: totalAmountPaise,
            currency: 'INR'
        });

        // 2. Load Razorpay Script
        const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) return alert('Razorpay SDK failed to load.');

        // 3. Configure Payment Options
        const options = {
            key: key_id, 
            amount: amount, 
            currency: currency,
            name: "MERN Ecom Store",
            description: "Purchase Checkout",
            order_id: id,
            handler: async function (response) {
                // This function runs on SUCCESSFUL payment!
                const paymentData = {
                    orderId: response.razorpay_order_id,
                    paymentId: response.razorpay_payment_id,
                    signature: response.razorpay_signature,
                    // Package all necessary data for final backend processing
                    orderDetails: {
                        items: cart.items,
                        shippingAddress: shippingAddress,
                        totalPrice: amount / 100 // Convert back to Rupees
                    }
                };

                // 4. Final Backend Call: Verify signature, create Order, deduct Inventory (Phase 6 logic)
                try {
                    await apiClient.post('/payment/verify-payment', paymentData);
                    alert("Payment successful! Order placed.");
                    // Redirect user to order history page
                    window.location.href = '/'; 
                } catch (err) {
                    alert('Payment verification failed after successful transaction.');
                }
            },
            prefill: {
                name: user.name,
                email: user.email,
            },
            theme: { color: "#528FF0" }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

   if (loading) return <h2 className="text-center text-white py-10">Loading Checkout...</h2>;

    return (
        <div className="flex justify-center items-center py-10 bg-gray-800">
            <div className="w-full max-w-lg p-8 space-y-6 bg-gray-900 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-white">Checkout Summary</h2>
                
                {cart && cart.items.length > 0 ? (
                    <div className="space-y-4">
                        <div className="text-gray-300">
                            <h3 className="font-semibold text-lg border-b border-gray-700 pb-2 mb-2">Shipping Address</h3>
                            <p>{shippingAddress}</p>
                        </div>
                        <div className="text-gray-300">
                            <h3 className="font-semibold text-lg border-b border-gray-700 pb-2 mb-2">Order Total</h3>
                            <p className="text-2xl font-bold text-blue-400">
                                ₹{cart.items.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                            </p>
                        </div>
                        <button 
                            onClick={displayRazorpay} 
                            className="w-full px-4 py-3 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900"
                        >
                            Pay with Razorpay
                        </button>
                    </div>
                ) : (
                    <p className="text-center text-gray-400">Your cart is empty.</p>
                )}
            </div>
        </div>
    );
};

export default CheckoutScreen;