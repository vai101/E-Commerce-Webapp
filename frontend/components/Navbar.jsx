import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CartIcon, UserIcon } from './Icons'; 

const Navbar = () => {
  const { user } = useSelector((state) => state.auth); 

  return (
    <nav>
      <div className="logo">
        <Link to="/">E-commerce</Link>
      </div>
      <div className="nav-links">
        <Link to="/products">Products</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="user-actions">
        {user ? (
          <>
            <CartIcon />
            <UserIcon />
            <span>{user.name}</span>
          </>
        ) : (
          <>
            <CartIcon />
            <UserIcon />
            {/* Do NOT render username if not logged in */}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;