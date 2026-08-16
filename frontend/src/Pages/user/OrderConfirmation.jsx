import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user") || "null")?.token;
    if (!token) return;
    axios.get(`${API_BASE_URL}/orders/${orderId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setOrder(data.data || data))
      .catch((err) => setError(err.response?.data?.message || "Unable to load order."));
  }, [orderId]);

  return <div className="container order-confirmation">
    <h1>Thank you for your order.</h1>
    {error ? <p>{error}</p> : order ? <><p>Order #{order._id.slice(-6)} has been created successfully.</p><p>Total: ₦{Number(order.totalAmount || 0).toLocaleString()}</p></> : <p>Loading order details...</p>}
    <Link to="/products">Continue Shopping</Link>
  </div>;
}
