import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./Components/common/Layout";
import ProtectedRoute from "./Components/common/ProtectedRoute";
import AdminRoute from "./Components/common/AdminRoute";
import HomePage from "./Pages/user/HomePage";
import ProductListPage from "./Pages/user/ProductListPage";
import CartPage from "./Pages/user/CartPage";
import CheckoutPage from "./Pages/user/CheckOutPage";
import LoginPage from "./Pages/user/LoginPage";
import UserRegister from "./Pages/user/RegistrationPage";
import UserDashboard from "./Pages/user/UserDashboard";
import OrderConfirmation from "./Pages/user/OrderConfirmation";
import ProductDetailPage from "./Pages/user/ProductDetailPage";
import AdminDashboard from "./Pages/admin/DashboardPage";
import AdminLoginPage from "./Pages/admin/LoginPage";
import RegisterPage from "./Pages/admin/RegisterPage";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<ProtectedRoute />} >
            <Route index element={<CheckoutPage />} />
          </Route>
          <Route path="/account" element={<ProtectedRoute />} >
            <Route index element={<UserDashboard />} />
          </Route>
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
