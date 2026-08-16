import React, { useEffect, useState } from "react";
import ProductCard from "../../Components/common/ProductCard";
import Img from "../../Assets/herobannerimg.png";
import HeroBanner from "../../Components/common/HeroBanner";
import Pagination from "../../Components/common/Pagination";
import WhyChooseUs from "../../Components/common/WhyChooseUs";
import Testimonials from "../../Components/common/Testimonials";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

import "./HomePage.css";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 4; 

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/products?page=${page}&limit=${limit}`
      );

      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  return (
    <div className="home-page">
      <HeroBanner />

      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Reusable Modern Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                Adeshola Cosmetics was born from a passion for creating
                high-quality, natural beauty products that enhance your natural
                radiance. Our carefully curated collection is designed to pamper
                your skin while making you feel confident and beautiful.
              </p>
              <button className="btn-secondary">Learn More</button>
            </div>
            <div className="about-image">
              <img src={Img} alt="About Luxury Cosmetics" />
            </div>
          </div>
        </div>
      </section>
      <WhyChooseUs/>
      <Testimonials/>
    </div>
  );
}

export default HomePage;
