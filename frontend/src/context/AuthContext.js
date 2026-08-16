import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { apiUrl } from "../config/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const request = async (url, options = {}, token = user?.token) => {
    const response = await fetch(apiUrl(url), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Request failed");
    return data;
  };

  const login = async (email, password) => {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const loggedInUser = { ...data.user, token: data.token };
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    navigate("/account");
    return loggedInUser;
  };

  const register = async (formData) => {
    const { confirmPassword, ...payload } = formData;
    if (confirmPassword && payload.password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    navigate("/login");
  };

  const updateProfile = async (profileData) => {
    const data = await request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
    const updatedUser = { ...user, ...data.user };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return data.user;
  };

  const logout = () => {
    setUser(null);
    clearCart();
    localStorage.removeItem("user");
    localStorage.removeItem("orders");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateProfile, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
