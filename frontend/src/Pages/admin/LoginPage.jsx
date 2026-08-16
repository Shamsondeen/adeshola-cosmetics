import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/admin/login`, { email, password });
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));
      toast.success("Login successful"); navigate("/admin/dashboard");
    } catch (err) { toast.error(err.response?.data?.message || "Invalid email or password"); }
    finally { setLoading(false); }
  };

  return <div className="admin-registration-container"><div className="admin-registration-form">
    <h2>Admin Login</h2>
    <form onSubmit={handleSubmit}>
      <div className="form-group"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
      <div className="form-group"><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
      <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Log In"}</button>
    </form>
  </div></div>;
}
