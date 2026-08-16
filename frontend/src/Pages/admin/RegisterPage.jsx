import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/admin/register`, { name: formData.name, email: formData.email, password: formData.password });
      toast.success("Registration successful. Please login."); navigate("/admin/login");
    } catch (error) { toast.error(error.response?.data?.message || "Registration failed"); }
    finally { setLoading(false); }
  };
  return <div className="admin-register-container"><h1>Register New Admin</h1><form onSubmit={handleSubmit} className="admin-form">
    <div className="form-group"><label>Name</label><input name="name" value={formData.name} onChange={handleChange} required /></div>
    <div className="form-group"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
    <div className="form-group"><label>Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} minLength="8" required /></div>
    <div className="form-group"><label>Confirm Password</label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} minLength="8" required /></div>
    <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register Admin"}</button>
  </form></div>;
}
