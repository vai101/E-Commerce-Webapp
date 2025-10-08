import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 

const UserIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
);
const LogOutIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
    </svg>
);
const PackageIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16 16.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3.5L2 12l2-3.5V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2.5L20 12l-4 3.5Z"/>
        <path d="M20 12H4"/>
    </svg>
);
const CartIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 12.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L21 6H6"/>
    </svg>
);
// -------------------------------------------------------------------


const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownRef]);

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate('/login');
    };

    const isAdmin = user && user.role === 'admin';

    return (
        <header className="bg-gray-900/90 backdrop-blur shadow-lg sticky top-0 z-10 animate-fadeIn">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                
                <Link to="/" className="text-2xl font-bold text-blue-400 tracking-wider hover:text-blue-300 transition duration-150 animate-pop">
                    Thriftshop
                </Link>

                <div className="flex items-center space-x-6">

                    <Link to="/cart" className="text-gray-300 hover:text-blue-400 transition duration-150" aria-label="Cart">
                        <CartIcon className="w-6 h-6" />
                    </Link>

                    <div ref={dropdownRef} className="relative">
                        {user ? (
                      
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none transition duration-150"
                                aria-expanded={dropdownOpen}
                                aria-haspopup="true"
                            >
                                <UserIcon className="w-6 h-6 text-yellow-400" />
                                <span className="hidden sm:inline font-medium">{user.name.split(' ')[0]}</span>
                            </button>
                        ) : (
 
                            <Link 
                                to="/login" 
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-150"
                            >
                                Sign In
                            </Link>
                        )}

                        {user && dropdownOpen && (
                            <div className="absolute right-0 mt-3 w-48 bg-gray-800 rounded-md shadow-xl overflow-hidden z-20 transition transform duration-150 origin-top-right">
                                <div className="py-1">
                                    <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                                        Hi, {user.name.split(' ')[0]}
                                    </div>
                                    <Link 
                                        to="/profile" 
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition duration-150"
                                    >
                                        <UserIcon className="w-4 h-4 mr-2"/> Profile
                                    </Link>
                                    <Link 
                                        to="/orders" 
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition duration-150"
                                    >
                                        <PackageIcon className="w-4 h-4 mr-2"/> Orders
                                    </Link>
                                    
                                    {isAdmin && (
                                        <>
                                            <Link 
                                                to="/admin/orders" 
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition duration-150"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM6.5 9.5a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm-5 4a1 1 0 01-1-1v-2h-2v2a3 3 0 006 0v-2h-2v2a1 1 0 01-1 1z" clipRule="evenodd" fillRule="evenodd"/></svg> Admin Panel
                                            </Link>
                                            <Link 
                                                to="/admin/products/new" 
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center px-4 py-2 text-sm text-yellow-400 hover:bg-gray-700 transition duration-150"
                                            >
                                                <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/></svg> Add Product
                                            </Link>
                                        </>
                                    )}

                                    <button 
                                        onClick={handleLogout}
                                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-700 transition duration-150 border-t border-gray-700 mt-1"
                                    >
                                        <LogOutIcon className="w-4 h-4 mr-2"/> Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;