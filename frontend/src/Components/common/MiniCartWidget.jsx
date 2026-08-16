// src/components/MiniCartWidget.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function MiniCartWidget() {
  const { cartItems } = useContext(useCart);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="mini-cart-widget">
      <Link to="/cart">
        🛒 <span>{totalItems}</span>
      </Link>
    </div>
  );
}
