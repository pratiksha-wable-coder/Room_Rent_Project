import React from "react";
import "./aboutus.css";

const AboutUs = () => {
  return (
    <section className="about-container" id="about-section">
      
      <h2 className="about-title">About Us</h2>

      <p className="about-description">
        Our platform helps tenants find rooms easily,
        owners manage their properties efficiently,
        and admins monitor the entire system smoothly.
      </p>

      <div className="about-features">

        <div className="feature-card">
          <h4>🏠 Easy Room Search</h4>
          <p>Tenants can browse and book rooms quickly.</p>
        </div>

        <div className="feature-card">
          <h4>📋 Property Management</h4>
          <p>Owners can add and manage their rooms easily.</p>
        </div>

        <div className="feature-card">
          <h4>🔐 Secure System</h4>
          <p>Admin controls and secure login for all users.</p>
        </div>

      </div>

      <p className="about-footer">
        © 2026 Room Rental Management System. All Rights Reserved.
      </p>
      <p className="about-contact">Contact us: info@roomrental.com</p>

    </section>
  );
};

export default AboutUs;