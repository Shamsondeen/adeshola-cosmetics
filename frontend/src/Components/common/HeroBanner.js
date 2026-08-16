// HeroSection.jsx
import React from "react";
import { Link } from 'react-router-dom';
import Img from '../../Assets/herobannerimg.png'
import './HeroBanner.css'


function HeroSection() {
  return (
    <section className="hero-section">
  <div className="hero-graphic">
    <img src={Img} alt="Shopper" />
  </div>

  <div className="hero-content">
    <div className="hero-text">
      <h1>Luxury Cosmetics brings you the finest beauty products with natural ingredients for radiant skin.</h1>
      <Link to="/products"><button className="hero-btn">Shop With Us</button></Link>
    </div>
  </div>
</section>

  );
}

export default HeroSection;


