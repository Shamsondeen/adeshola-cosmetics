// src/pages/CartPage/CartPage.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

import './CartPage.css'

const CartPage = () => {
  const { cart, removeFromCart, clearCart, updateQty } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-info">
                  <img
                    src={item.images?.[0] || "/placeholder.png"}
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div>
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-price">₦{item.price}</p>

                    {/* Quantity controls */}
                    {/* Quantity controls */}
                    <div className="quantity-selector">
                      <button
                        onClick={() =>
                          updateQty(item._id, Math.max(1, item.qty - 1))
                        }
                        disabled={item.qty <= 1}
                        className="qty-btn minus"
                      >
                        –
                      </button>

                      <span className="qty-display">{item.qty}</span>

                      <button
                        onClick={() =>
                          updateQty(
                            item._id,
                            item.countInStock
                              ? Math.min(item.countInStock, item.qty + 1)
                              : item.qty + 1
                          )
                        }
                        disabled={
                          item.countInStock && item.qty >= item.countInStock
                        }
                        className="qty-btn plus"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₦{totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>₦{totalPrice.toFixed(2)}</span>
            </div>

            <button onClick={clearCart} className="btn-outline">
              Clear Cart
            </button>
            <button
              onClick={() => {
                if (!user) {
                  navigate("/login");
                } else {
                  navigate("/checkout");
                }
              }}
              className="btn-primary"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
