import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ProductCard from "../../Components/common/ProductCard";
import Pagination from "../../Components/common/Pagination";
import { API_BASE_URL } from "../../config/api";

const PRODUCTS_PER_PAGE = 12;

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_BASE_URL}/products`, {
          params: { page, limit: PRODUCTS_PER_PAGE },
        });
        if (!cancelled) {
          setProducts(data.products || []);
          setTotalPages(data.totalPages || 1);
        }
      } catch {
        if (!cancelled) { setProducts([]); setTotalPages(1); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProducts();
    return () => { cancelled = true; };
  }, [page]);

  const filteredProducts = useMemo(() => products
    .filter((p) => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((p) => category === "all" || p.category === category)
    .sort((a, b) => {
      if (sort === "priceLow") return a.price - b.price;
      if (sort === "priceHigh") return b.price - a.price;
      return new Date(b.createdAt) - new Date(a.createdAt);
    }), [products, searchTerm, category, sort]);

  return (
    <div className="shop-page container">
      <section className="shop-header">
        <h1 className="section-title">Our Shop</h1>
        <div className="shop-filters">
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products..." />
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            <option value="all">All Categories</option>
            <option value="skincare">Skincare</option>
            <option value="makeup">Makeup</option>
            <option value="haircare">Haircare</option>
            <option value="fragrance">Fragrance</option>
            <option value="bath-body">Bath & Body</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="latest">Latest</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>
        </div>
      </section>

      <section className="products-grid-section">
        {loading ? <p>Loading...</p> : filteredProducts.length === 0 ? <p className="no-products">No products found.</p> : <div className="products-grid">{filteredProducts.map((product) => <ProductCard key={product._id} product={product} />)}</div>}
      </section>

      {!loading && totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
    </div>
  );
}
