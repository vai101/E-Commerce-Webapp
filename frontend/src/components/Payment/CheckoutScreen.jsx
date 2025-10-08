import React, { useState, useEffect } from 'react';
import apiClient from '../../api/api';
import loadRazorpayScript from '../../utils/loadRazorpayScript';
import { useAuth } from '../../context/AuthContext'; 

const CheckoutScreen = () => {
    const { user } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
    });
    const [saveAddress, setSaveAddress] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            const { data } = await apiClient.get('/cart');
            setCart(data);
            setLoading(false);
        };
 
        const saved = localStorage.getItem('shippingAddress');
        if (saved) {
            try {
                setShippingAddress(JSON.parse(saved));
            } catch {}
        } else if (user) {
        
            setShippingAddress((prev) => ({ ...prev, fullName: user.name || '' }));
        }
        fetchCart();
    }, [user]);

    const displayRazorpay = async () => {
        if (!cart || cart.items.length === 0) return alert("Cart is empty.");

        const totalAmountPaise = Math.round(cart.items.reduce((acc, item) => acc + item.qty * item.price, 0) * 100);

        const { data: { id, currency, amount, key_id } } = await apiClient.post('/payment/create-order', {
            amount: totalAmountPaise,
            currency: 'INR'
        });

        const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) return alert('Razorpay SDK failed to load.');

        const options = {
            key: key_id, 
            amount: amount, 
            currency: currency,
            name: "MERN Ecom Store",
            description: "Purchase Checkout",
            order_id: id,
            handler: async function (response) {

                const paymentData = {
                    orderId: response.razorpay_order_id,
                    paymentId: response.razorpay_payment_id,
                    signature: response.razorpay_signature,
                 
                    orderDetails: {
                        items: cart.items,
                        shippingAddress: shippingAddress,
                        totalPrice: amount / 100 
                    }
                };

                try {
                    await apiClient.post('/payment/verify-payment', paymentData);
                    if (saveAddress) {
                        localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
                    }
                    alert("Payment successful! Order placed.");

                    window.location.href = '/'; 
                } catch (err) {
                    alert('Payment verification failed after successful transaction.');
                }
            },
            prefill: {
                name: shippingAddress.fullName || user.name,
                email: user.email,
                contact: shippingAddress.phone || undefined,
            },
            theme: { color: "#528FF0" }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

   if (loading) return <h2 className="text-center text-white py-10">Loading Checkout...</h2>;

    return (
        <div className="flex justify-center items-center py-10 bg-gray-800">
            <div className="w-full max-w-4xl p-8 space-y-6 bg-gray-900 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-white">Checkout</h2>

                {cart && cart.items.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                        <div className="lg:col-span-2 text-gray-300">
                            <h3 className="font-semibold text-lg border-b border-gray-700 pb-2 mb-4">Shipping Address</h3>
                            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); displayRazorpay(); }}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={shippingAddress.fullName}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                                            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            value={shippingAddress.phone}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Address Line 1</label>
                                    <input
                                        type="text"
                                        value={shippingAddress.addressLine1}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                                        className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Address Line 2 (Optional)</label>
                                    <input
                                        type="text"
                                        value={shippingAddress.addressLine2}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
                                        className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm mb-1">City</label>
                                        <input
                                            type="text"
                                            value={shippingAddress.city}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">State</label>
                                        <input
                                            type="text"
                                            value={shippingAddress.state}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm mb-1">Postal Code</label>
                                        <input
                                            type="text"
                                            value={shippingAddress.postalCode}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Country</label>
                                        <input
                                            type="text"
                                            value={shippingAddress.country}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <label className="flex items-center gap-2 select-none">
                                    <input
                                        type="checkbox"
                                        checked={saveAddress}
                                        onChange={(e) => setSaveAddress(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-300">Save this address for future checkouts</span>
                                </label>
                            </form>
                        </div>

                        <div className="bg-gray-800 rounded-lg shadow-md p-6 h-fit">
                            <h3 className="text-2xl font-bold text-white border-b border-gray-700 pb-4 mb-4">
                                Order Summary
                            </h3>
                            <div className="space-y-2 text-gray-300">
                                {cart.items.map((item) => (
                                    <div key={item.product?._id || item.product} className="flex justify-between">
                                        <span className="truncate pr-2">{item.name} × {item.qty}</span>
                                        <span>₹{(item.qty * item.price).toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between font-bold text-white text-xl mt-4 pt-4 border-t border-gray-700">
                                    <span>Total</span>
                                    <span>₹{cart.items.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
                                </div>
                            </div>
                            <button 
                                onClick={displayRazorpay} 
                                className="w-full mt-6 px-4 py-3 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900"
                            >
                                Pay with Razorpay
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-400">Your cart is empty.</p>
                )}
            </div>
        </div>
    );
};

export default CheckoutScreen;