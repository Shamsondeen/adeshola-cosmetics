# 🛍️ Adeshola Cosmetics

A full-stack cosmetics e-commerce platform built with the MERN stack, providing a complete online shopping experience with customer authentication, product management, cart and checkout functionality, order processing, payment integration, email notifications, cloud-based image management, and an administrative dashboard.

---

## 📌 Overview

Adeshola Cosmetics is an e-commerce application designed around the complete customer-to-order lifecycle.

Customers can browse available cosmetic products, view product details, create accounts, manage their shopping cart, place orders, and make payments.

Administrators have access to a protected dashboard where they can manage products, monitor orders, and update order/payment statuses.

The system also integrates email notifications and cloud-based product image management to support the operational side of the store.

---

## ✨ Key Features

### 🛒 Customer Shopping Experience

- Browse available cosmetic products
- Product listing and pagination
- View detailed product information
- Add products to cart
- Update product quantities
- Remove products from cart
- View cart totals
- Proceed through checkout
- Place orders
- View order confirmation
- Access customer dashboard
- View order information

### 🔐 Authentication

- Customer registration
- Customer login
- JWT-based authentication
- Protected customer routes
- Protected administrative routes
- Administrator authentication
- Authentication state management

### 👨‍💼 Admin Dashboard

Administrators can:

- Access a protected administrative dashboard
- Manage products
- Add products
- Update products
- Delete products
- View customer orders
- Monitor order information
- Update order status
- Update payment status
- Manage the operational side of the store

### 💳 Payment Integration

The application integrates **Flutterwave** for online payment processing.

The payment workflow supports:

```text
Customer
   ↓
Checkout
   ↓
Create Order
   ↓
Initialize Payment
   ↓
Flutterwave
   ↓
Payment Verification
   ↓
Update Order
   ↓
Customer Confirmation