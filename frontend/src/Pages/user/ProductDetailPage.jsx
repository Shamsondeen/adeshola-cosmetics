import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useCart } from "../../context/CartContext";
import { API_BASE_URL } from "../../config/api";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/products/slug/${slug}`
        );
        const fetchedProduct = res.data.data || res.data;
        setProduct(fetchedProduct);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  if (loading)
    return (
      <div className="loading-screen">
        <CircularProgress />
      </div>
    );
  if (error)
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  if (!product)
    return (
      <div className="error-message">
        <p>Product not found</p>
      </div>
    );

  return (
    <div className="product-detail-container">
      <div className="product-detail-wrapper">
        {/* LEFT: Image gallery */}
        <div className="product-gallery">
          <div className="main-image">
            <img
              src={
                product.images && product.images.length > 0
                  ? typeof product.images[0] === "string"
                    ? product.images[0]
                    : product.images[0].url
                  : "/placeholder.png"
              }
              alt={product.name}
            />
          </div>
          <div className="thumbnail-row">
            {product.images?.map((image, index) => (
              <img
                key={index}
                src={typeof image === "string" ? image : image.url}
                alt={`${product.name} ${index + 1}`}
                className="thumbnail"
              />
            ))}
          </div>
        </div>

        {/* RIGHT: Product info */}
        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">₦{product.price}</p>
          <p className="product-description">{product.description}</p>

          {/* Show status directly from backend */}
          <p className="product-status">
            Status:{" "}
            {product.status
              ? product.status
              : product.stock > 0
              ? "Available"
              : "Sold Out"}
          </p>

          <button
            className="add-to-cart-btn"
            onClick={() => addToCart({ ...product, qty })}
            disabled={product.stock === 0 || product.status === "Sold Out"}
          >
            Add To Cart
          </button>
          <Link to="/" className="back-link">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
