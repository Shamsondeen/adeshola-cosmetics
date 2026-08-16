import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = () => {
    if (!product || !product._id) {
      alert("Invalid product data");
      return;
    }

    // Call the CartContext function instead of handling localStorage here
    addToCart(product, user?._id);

    alert("Product added to cart successfully!");
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.slug}`} className="product-image">
        <img
          src={product.images?.[0] || ""}
          alt={product.name}
          onError={(e) => { e.target.src = ""; }}
        />
        {product.status === 'sold-out' && (
          <span className="product-badge">Sold Out</span>
        )}
      </Link>

      <div className="product-info">
        <h3 className="product-name">
          <Link to={`/products/${product.slug}`}>
            {product.name?.toUpperCase()}
          </Link>
        </h3>
        <div className="product-price">
          {product.discountedPrice ? (
            <>
              <span className="original-price">₦{product.price.toFixed(2)}</span>
              <span className="discounted-price">₦{product.discountedPrice.toFixed(2)}</span>
            </>
          ) : (
            <span>₦{product.price.toFixed(2)}</span>
          )}
        </div>
      </div>

      <button
        className="add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={product.status === 'sold-out'}
      >
        {product.status === 'sold-out' ? 'Unavailable' : 'Add to Cart'}
      </button>
    </div>
  );
}

export default ProductCard;
