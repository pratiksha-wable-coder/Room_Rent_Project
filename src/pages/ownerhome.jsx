import React from "react";
import { Link } from "react-router-dom";
import "./ownerhome.css";

import Navbar from "./navbar"; // Import the separated Navbar
import Room from "./home_room.jpeg";
import AboutUs from "./aboutus";
import Tenants from "./tenant_home.jpeg";

const OwnerHome = () => {
  const cards = [
    {
      title: "Room",
      desc: "This page contains the details of all Houses.",
      img: Room,
      link: "/room_details",
    },
    {
      title: "Tenants",
      desc: "This page contains the details of all Tenants.",
      img: Tenants,
      link: "/tenants_details",
    },
  ];

  return (
    <div className="home-container">
      <Navbar /> {/* Use the navbar here */}

      {/* MAIN CONTENT */}
      <div className="home-content">
        <h1>Welcome</h1>

        <div className="card-grid">
          {cards.map((card, index) => (
            <div className="card" key={index}>
              <img src={card.img} alt={card.title} />
              <h3>{card.title}</h3>
              <p>{card.desc}</p>

              <Link to={card.link} className="details-btn">
                See Details
              </Link>
            </div>
          ))}
        </div>
      </div>
       <div id="about-section">
       <AboutUs />
     </div>
    </div>
  );
};

export default OwnerHome;