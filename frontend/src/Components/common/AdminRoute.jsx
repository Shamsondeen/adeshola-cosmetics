import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const token = localStorage.getItem("adminToken");
  return token ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
