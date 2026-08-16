import React, { Component } from 'react'

// components/admin/LoginForm.jsx
export default function LoginForm({ credentials, setCredentials, onSubmit, loading, error }) {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setCredentials(prev => ({ ...prev, [name]: value }));
    };
  
    return (
      <form onSubmit={onSubmit} className="login-form">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            autoFocus
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
  
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    );
  }
