import React from 'react';
import { Link } from 'react-router-dom';


function HeroSection({ title, subtitle, buttonText, buttonLink }) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="container">
          <div className="hero-text">
            <h1>{title}</h1>
            <p>{subtitle}</p>
            <Link to={buttonLink} className="hero-btn">
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
      <div className="hero-overlay"></div>
    </section>
  );
}

export default HeroSection;