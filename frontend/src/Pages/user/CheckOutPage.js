import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

import './CheckoutPage.css'
import { apiUrl } from "../../config/api"



function CheckoutPage() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "Nigeria",
    postalCode: "",
    paymentMethod: "card",
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


const createOrder = async (paymentStatus = "pending") => {
  if (!user || !user.token) {
    throw new Error("User not logged in. Cannot create order.");
  }

  const res = await fetch(apiUrl("/orders"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify({
      orderItems: cart.map((item) => ({
        product: item._id || item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        image: item.images?.[0] || "",
      })),
      shippingAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      paymentMethod: formData.paymentMethod,
      itemsPrice: subtotal,
      shippingPrice: shipping,
      totalAmount: total,
      paymentStatus,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to create order");
  }

  const data = await res.json();
  return data._id || data.orderId;
};



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.paymentMethod === "card") {
      try {
        const orderId = await createOrder("initiated");
        const paymentResponse = await fetch(apiUrl(`/orders/${orderId}/pay`), {
          method: "POST",
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const paymentData = await paymentResponse.json();
        if (!paymentResponse.ok) throw new Error(paymentData.message || "Unable to initialize payment");
        window.location.href = paymentData.paymentLink;
      } catch (error) {
        alert(error.message);
      }
    } else if (formData.paymentMethod === "bank-transfer") {
      await handleBankTransferConfirm();
    } else if (formData.paymentMethod === "pay-on-delivery") {
      const orderId = await createOrder("cod");
      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    }
  };


const notifyBankTransfer = async (orderId, transferDetails) => {
  if (!user || !user.token) {
    throw new Error("User not logged in. Cannot notify transfer.");
  }

  const res = await fetch(apiUrl(`/orders/${orderId}/confirm-bank-transfer`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,  
    },
    body: JSON.stringify({
      orderId,
      transferDetails,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to notify transfer");
  }

  return await res.json();
};


const handleBankTransferConfirm = async () => {
  try {
    const orderId = await createOrder("pending");

    await notifyBankTransfer(orderId, {
      user: formData,
      order: cart,
      total,
    });

    clearCart();
    navigate(`/order-confirmation/${orderId}`);
  } catch (err) {
    console.error("Bank transfer error:", err);
    alert("Something went wrong while confirming your bank transfer.");
  }
};

  return (
    <div className="checkout-page container">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-grid">
        <form onSubmit={handleSubmit} className="checkout-form">
       
          <section className="form-section">
            <h2 className="section-title">Contact Information</h2>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </section>

          {/* Shipping Info */}
          <section className="form-section">
            <h2 className="section-title">Shipping Address</h2>
            <input
              type="text"
              name="street"
              placeholder="Street Address"
              value={formData.street}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </section>

          {/* Payment */}
          <section className="form-section">
            <h2 className="section-title">Payment Method</h2>

            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === "card"}
                onChange={handleChange}
              />
              Credit/Debit Card
            </label>
            {formData.paymentMethod === "card" && (
              <div className="payment-details">
                <p>You will be redirected to securely pay with your card.</p>
              </div>
            )}

            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="bank-transfer"
                checked={formData.paymentMethod === "bank-transfer"}
                onChange={handleChange}
              />
              Bank Transfer
            </label>
            {formData.paymentMethod === "bank-transfer" && (
              <div className="payment-details">
                <p><strong>Bank:</strong> Zenith Bank</p>
                <p><strong>Account Number:</strong> 1234567890</p>
                <p><strong>Account Name:</strong> Luxury Cosmetics Ltd</p>
                <button
                  type="button"
                  onClick={handleBankTransferConfirm}
                  className="btn-success"
                >
                  I Have Made Payment
                </button>
              </div>
            )}

            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="pay-on-delivery"
                checked={formData.paymentMethod === "pay-on-delivery"}
                onChange={handleChange}
              />
              Pay on Delivery
            </label>
          </section>
        </form>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <aside className="order-summary">
          <h2 className="section-title">Order Summary</h2>
          {cart.map((item) => (
            <div key={item._id} className="summary-item">
              <img
                src={item.images?.[0] || ""}
                alt={item.name}
                className="summary-thumb"
              />
              <div className="summary-details">
                <p>{item.name}</p>
                <p>
                  {item.qty} = ₦{item.price}
                </p>
              </div>
            </div>
          ))}

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₦{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>₦{shipping}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₦{total.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="btn-primary place-order-btn"
          >
            Place Order
          </button>
        </aside>
      </div>
    </div>
  );
}

export default CheckoutPage;
