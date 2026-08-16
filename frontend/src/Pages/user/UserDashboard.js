import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import DashboardLayout from "../../Components/common/UserDashboardLayout";
import { apiUrl } from "../../config/api";

function UserDashboard() {
  const { user, updateProfile } = useAuth();
  const { addToCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    address: "",
    email: "",
    phone: ""
  });

  // ✅ Load orders when user is available
  useEffect(() => {
    if (!user) return;

    setProfileData({
      name: user.name,
      address: user.address || "",
      email: user.email,
      phone: user.phone || ""
    });

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          apiUrl("/orders/myorders"),
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch orders. Please try again later.");
        }

        const data = await response.json();
        setOrders(data);

        // ✅ Cache for offline support
        localStorage.setItem("orders", JSON.stringify(data));
      } catch (err) {
        console.warn("⚠️ Fallback to cached orders:", err.message);
        setError(err.message);

        // ✅ Gracefully fallback to localStorage
        const cached = JSON.parse(localStorage.getItem("orders") || "[]");
        setOrders(cached);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // ✅ Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Profile update failed. Please try again.");
    }
  };

  // ✅ Loading State
  if (loading) {
    return <div className="loading">⏳ Loading your dashboard...</div>;
  }

  return (
    <>
      <div className="user-dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <h1>My Account</h1>
          <p>Welcome back, {user?.name}</p>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            My Orders
          </button>
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </div>

        {/* Error Message */}
        {error && <div className="error-message">⚠️ {error}</div>}

        {/* Content */}
        <div className="dashboard-content">
          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="orders-tab">
              <h2>Order History</h2>
              {orders.length === 0 ? (
                <div className="empty-orders">
                  <p>You haven’t placed any orders yet.</p>
                  <Link to="/products" className="shop-btn">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order, idx) => (
                    <div key={order._id || idx} className="order-card">
                      {/* Order Header */}
                      <div className="order-header">
                        <div className="order-meta">
                          <span className="order-id">
                            Order #{order._id ? order._id.slice(-6) : idx + 1}
                          </span>
                          <span className="order-date">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                        <div
                          className={`order-status ${order.status || "pending"}`}
                        >
                          {order.status
                            ? order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)
                            : "Pending"}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="order-items">
                        {order.items?.slice(0, 3).map((item, i) => (
                          <div key={item._id || i} className="order-item">
                            <img
                              src={item.product?.images?.[0] || "/placeholder.jpg"}
                              alt={item.product?.name || "Product"}
                              className="item-image"
                            />
                            <div className="item-details">
                              <h4>{item.product?.name || "Unknown product"}</h4>
                              <p>Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <div className="more-items">
                            +{order.items.length - 3} more items
                          </div>
                        )}
                      </div>

                      {/* Order Footer */}
                      <div className="order-footer">
                        <div className="order-total">
                          Total: ₦
                          {order.totalAmount
                            ? order.totalAmount.toFixed(2)
                            : "0.00"}
                        </div>
                        <Link
                          to={`/orders/${order._id || idx}`}
                          className="view-order-btn"
                        >
                          View Order
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="profile-tab">
              <h2>Profile Information</h2>
              {editMode ? (
                <form onSubmit={handleProfileUpdate}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          address: e.target.value
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-info">
                  <div className="info-row">
                    <span className="info-label">Full Name:</span>
                    <span className="info-value">{user.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{user.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">
                      {user.phone || "Not provided"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Address:</span>
                    <span className="info-value">
                      {user.address || "Not provided"}
                    </span>
                  </div>

                  <button
                    className="edit-btn"
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
