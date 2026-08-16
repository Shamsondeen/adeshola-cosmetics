import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

import './Header.css'

function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">Adeshola Cosmetics</Link>
          </div>
          <nav className="main-nav">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Shop</Link></li>
            </ul>
          </nav>
          <div className="header-actions">
            <Link to="/cart" className="cart-icon">
              <i className="fas fa-shopping-bag"></i>
              <span className="cart-count">{cart.length}</span>
            </Link>
            {user ? (
              <div className="user-dropdown">
                <span className="user-greeting">Hi, {user.name}</span>
                <div className="dropdown-content">
                  <Link to="/account">My Account</Link>
                  <button onClick={logout}>Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="login-btn">Login</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
