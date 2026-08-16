import React from 'react';


function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About Us</h4>
            <p>Adeshola Cosmetics brings you the finest beauty products with natural ingredients for radiant skin.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/products">Shop</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: info@adesholacosmetics.com</p>
            <p>Phone: +1 (123) 456-7890</p>
          </div>
          <div className="footer-section">
            <h4>Newsletter</h4>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Adeshola Cosmetics. All rights reserved.</p>
          <div className="social-links">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-pinterest-p"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;