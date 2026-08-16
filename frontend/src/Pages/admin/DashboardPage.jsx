import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

// Register chart components
Chart.register(...registerables);

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "skincare",
    stock: "",
    status: "available"
  });

  // ✅ Toast State
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  // Fetch products, orders, users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await axios.get(`${API_BASE_URL}/products/admin`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`
          }
        });
        setProducts(
          Array.isArray(productsRes.data)
            ? productsRes.data
            : productsRes.data.products || []
        );

        const ordersRes = await axios.get(`${API_BASE_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`
          }
        });
        setOrders(
          ordersRes.data.data ? ordersRes.data.data.orders : ordersRes.data
        );

        const usersRes = await axios.get(`${API_BASE_URL}/auth/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`
          }
        });
        setUsers(usersRes.data.data ? usersRes.data.data.users : usersRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        showToast("Failed to fetch dashboard data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chart data for orders overview
  const ordersChartData = {
    labels: ["Pending", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        label: "Order Status",
        data: [
          orders.filter((o) => o.status === "pending").length,
          orders.filter((o) => o.status === "shipped").length,
          orders.filter((o) => o.status === "delivered").length,
          orders.filter((o) => o.status === "cancelled").length
        ],
        backgroundColor: [
          "rgba(255, 206, 86, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 99, 132, 0.7)"
        ],
        borderColor: [
          "rgba(255, 206, 86, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  const [salesData, setSalesData] = useState({
    labels: [],
    data: [],
    year: new Date().getFullYear()
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  // Fetch available years
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/orders/sales/years`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`
          }
        });
        setAvailableYears(res.data.years);

        // If current year not in DB, default to latest year
        if (!res.data.years.includes(selectedYear)) {
          setSelectedYear(res.data.years[res.data.years.length - 1]);
        }
      } catch (error) {
        console.error("Error fetching available years:", error);
      }
    };
    fetchYears();
  }, []);

  // Fetch sales data when year changes
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/orders/sales/monthly?year=${selectedYear}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`
            }
          }
        );
        setSalesData(res.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    if (selectedYear) fetchSales();
  }, [selectedYear]);

  // Chart data
  const salesChartData = {
    labels: salesData.labels,
    datasets: [
      {
        label: `Sales (₦) - ${salesData.year}`,
        data: salesData.data,
        backgroundColor: "rgba(212, 175, 115, 0.7)",
        borderColor: "rgba(212, 175, 115, 1)",
        borderWidth: 1
      }
    ]
  };

  const handleProductStatusChange = async (productId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${productId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error("Failed to update product status");

      const updatedProduct = await res.json();

      setProducts(
        products.map((p) => (p._id === productId ? updatedProduct : p))
      );

      showToast("✅ Product status updated successfully");
    } catch (error) {
      console.error("Error updating product status:", error);
      showToast("❌ Failed to update product status", "error");
    }
  };

  // ✅ Update Order Status & Payment Status
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error("Failed to update order");

      const data = await res.json();

      setOrders(
        orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );

      showToast("✅ Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      showToast("❌ Failed to update order status", "error");
    }
  };

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify({
          paymentStatus: newPaymentStatus
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update payment status");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                paymentStatus: data.paymentStatus || newPaymentStatus
              }
            : order
        )
      );

      showToast("✅ Payment status updated successfully");
    } catch (error) {
      console.error("Error updating payment status:", error);
      showToast(`❌ ${error.message}`, "error");
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", newProduct.name.trim());
      formData.append("description", newProduct.description.trim());
      formData.append("price", newProduct.price);
      formData.append("category", newProduct.category);
      formData.append("stock", newProduct.stock);
      formData.append("status", newProduct.status);

      if (newProduct.discountedPrice) {
        formData.append("discountedPrice", newProduct.discountedPrice);
      }

      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      setProducts((prev) => [...prev, data]);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "skincare",
        stock: "",
        status: "available",
        discountedPrice: ""
      });
      setImages([]);
      setImagePreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      showToast("✅ Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      showToast("❌ Failed to add product", "error");
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      {toast.message && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}

      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="header-stats">
          <div className="stat-card">
            <h3>Total Products</h3>
            <p>{products.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p>{orders.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{users.length}</p>
          </div>
          <div className="stat-card">
            <h3>Revenue</h3>
            <p>
              ₦
              {orders
                .reduce((sum, order) => sum + order.totalAmount, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
      </div>

      <div className="dashboard-content">
        {/* === Overview === */}
        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="chart-container">
              <div className="chart-card">
                <h3>Order Status</h3>
                <div className="chart-wrapper">
                  <Pie
                    data={ordersChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "bottom"
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <div className="chart-card">
                <h3>Sales Overview</h3>
                <div className="chart-wrapper">
                  <div className="year-filter">
                    <label htmlFor="year-select">Select Year: </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                      {availableYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Bar
                    data={salesChartData}
                    options={{
                      responsive: true,
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Orders</h3>
              <div className="activity-list">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="activity-item">
                    <div className="activity-info">
                      <span className="order-id">#{order._id.slice(-6)}</span>
                      <span className="customer">{order.user.name}</span>
                      <span className="amount">
                        ₦{order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="activity-status">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleOrderStatusChange(order._id, e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === Products === */}
        {activeTab === "products" && (
          <div className="products-tab">
            <div className="add-product-form">
              <h3>Add New Product</h3>
              <form onSubmit={handleAddProduct}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value
                        })
                      }
                    >
                      <option value="skincare">Skincare</option>
                      <option value="makeup">Makeup</option>
                      <option value="haircare">Haircare</option>
                      <option value="fragrance">Fragrance</option>
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, stock: e.target.value })
                      }
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={newProduct.status}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, status: e.target.value })
                    }
                  >
                    <option value="available">Available</option>
                    <option value="sold-out">Sold Out</option>
                    <option value="coming-soon">Coming Soon</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Product Images</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      multiple
                      accept="image/*"
                      className="image-upload-input"
                      id="product-images"
                    />
                    <label
                      htmlFor="product-images"
                      className="image-upload-label"
                    >
                      <i className="fas fa-cloud-upload-alt"></i>
                      <span>Choose Images (Max 5)</span>
                    </label>

                    {imagePreviews.length > 0 && (
                      <div className="image-preview-container">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="image-preview-item">
                            <img src={preview} alt={`Preview ${index}`} />
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={() => removeImage(index)}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <small className="form-text">
                    Upload at least one image (JPEG, PNG, max 2MB each)
                  </small>
                </div>

                <button type="submit" disabled={images.length === 0}>
                  Add Product
                </button>
              </form>
            </div>

            <div className="products-list">
              <h3>All Products</h3>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <div className="product-info">
                            <img src={product.images[0]} alt={product.name} />
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>{product.category}</td>
                        <td>₦ {product.price.toFixed(2)}</td>
                        <td>{product.stock}</td>
                        <td>
                          <select
                            value={product.status}
                            onChange={(e) =>
                              handleProductStatusChange(
                                product._id,
                                e.target.value
                              )
                            }
                          >
                            <option value="available">Available</option>
                            <option value="sold-out">Sold Out</option>
                            <option value="coming-soon">Coming Soon</option>
                          </select>
                        </td>
                        <td>
                          <Link
                            to={`/products/${product.slug}`}
                            className="edit-btn"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* === Orders === */}
        {activeTab === "orders" && (
          <div className="orders-tab">
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-6)}</td>
                      <td>{order.user.name}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>₦{order.totalAmount.toFixed(2)}</td>
                      <td>
                        <select
                          value={order.paymentStatus}
                          onChange={(e) =>
                            handlePaymentStatusChange(order._id, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Payment Received</option>
                          <option value="refunded">Refunded</option>
                          <option value="failed">Failed</option>
                        </select>
                      </td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleOrderStatusChange(order._id, e.target.value)
                          }
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <Link to={`/account`} className="view-btn">
                          Account
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === Users === */}
        {activeTab === "users" && (
          <div className="users-tab">
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Orders</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        {orders.filter((o) => o.user._id === user._id).length}
                      </td>
                      <td
                        className={`user-status ${
                          user.isActive ? "active" : "inactive"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
