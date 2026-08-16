import React from "react";
import Img from "../../Assets/herobannerimg.png";
import "./WhyChooseUs.css";

const WhyChooseUs = () => {
  return (
    <section className="why-section">
      {/* Tag */}
      <div className="section-tag">INNOVATION</div>

      {/* Heading */}
      <h2 className="section-title">Why style lovers choose LUXURA</h2>
      <p className="section-subtitle">
        Exceptional services and unparalleled craftsmanship that set the
        standard for luxury fashion.
      </p>

      {/* Cards Grid */}
      <div className="why-grid">
        {/* Card 1 */}
        <div className="why-card large-card">
            <div className="img-card">
          <img
            src={Img}
            alt="Craftsmanship"
            className="why-img"
          /></div>
          <h3 className="why-text">
            Handcrafted by master artisans to deliver timeless elegance and unmatched quality.
          </h3>
          <button className="explore-btn">Explore Collection</button>
        </div>

        {/* Card 2 */}
        <div className="why-card small-card">
          <img
            src={Img}
            alt="Trusted"
            className="why-img"
          />
          <h3 className="why-text">
            Trusted by fashion connoisseurs worldwide.
          </h3>
        </div>

        {/* Card 3 */}
        <div className="why-card small-card">
          <img
            src={Img}
            alt="50 Years"
            className="why-img"
          />
          <h3 className="why-text bold">50%</h3>
          <p className="why-subtext">Years of heritage craftsmanship.</p>
        </div>

        {/* Card 4 (wide) */}
        <div className="why-card wide-card">
          <h3 className="why-text">
            Elevates personal style and transforms your wardrobe into a statement of luxury.
          </h3>
          <img
            src={Img}
            alt="Style"
            className="why-img"
          />
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
