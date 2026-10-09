import React from "react";
import { Link } from "react-router-dom";
import "./tenanthome.css";

import Navbar from "./navbar";
import Room from "./home_room.jpeg"; 
import AboutUs from "./aboutus"; 

const TenantHome = () => {
  const cards = [
    {
      title: "Room",
      desc: "This page contains the details of all Houses available for rent.",
      img: Room,
      link: "/room_details",
    }
  ];

  return (
    <div className="home-container">
      <Navbar />
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
      <AboutUs />
    </div>
  );
};

export default TenantHome;