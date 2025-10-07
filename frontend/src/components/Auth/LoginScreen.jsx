// src/components/Auth/LoginScreen.jsx (Updated)
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useAuth();
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="flex justify-center items-center py-10 bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-white">Sign In</h2>
                
                {error && <p className="text-red-500 text-center">{error}</p>}
                
                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:bg-gray-500"
                    >
                        {loading ? 'Logging In...' : 'Sign In'}
                    </button>
                </form>
                
                <p className="text-sm text-center text-gray-400">
                    New Customer?{' '}
                    <Link to="/register" className="font-medium text-blue-400 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;