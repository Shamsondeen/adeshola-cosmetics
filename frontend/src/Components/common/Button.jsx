// src/components/common/Button.jsx
import React from 'react';


const Button = ({ children, onClick, variant = 'primary', disabled = false, type = 'button' }) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    success: 'btn-success',
  };

  return (
    <button
      type={type}
      className={`btn ${variants[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;