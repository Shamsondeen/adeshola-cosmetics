// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/main.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;