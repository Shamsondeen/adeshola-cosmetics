import React from "react";
import "./Testimonials.css";

const Testimonials = () => {
  const data = [
    {
      quote:
        "LUXURA completely transformed my style! The AI recommendations are spot-on, and I’ve discovered brands I never would have found otherwise.",
      name: "Emma Rodríguez",
      role: "Fashion Blogger",
    },
    {
      quote:
        "Finally, a platform that truly understands my aesthetic. The personalized curation saves me hours of browsing and always delivers amazing pieces.",
      name: "Sarah Chen",
      role: "Creative Director",
    },
    {
      quote:
        "The quality of recommendations is incredible. Every piece I’ve ordered through LUXURA has become a staple in my wardrobe.",
      name: "Maria Santos",
      role: "Style Enthusiast",
    },
    {
      quote:
        "LUXURA’s AI knows my style better than I do! It’s like having a personal stylist who’s always available and never misses the mark.",
      name: "Jessica Park",
      role: "Fashion Influencer",
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="section-tag">TESTIMONIALS</div>

      <h2 className="section-title">What our clients say</h2>
      <p className="section-subtitle">
        Hear from fashion industry leaders who trust LUXURA STUDIO for their most important moments
      </p>

      <div className="testimonials-grid">
        {data.map((item, i) => (
          <div className="testimonial-card" key={i}>
            <p className="testimonial-quote">“{item.quote}”</p>

            <div className="testimonial-author">
              <div className="avatar"></div>
              <div>
                <h4>{item.name}</h4>
                <span>{item.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
