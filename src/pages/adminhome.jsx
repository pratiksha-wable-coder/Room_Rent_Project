import React from "react";
import { Link } from "react-router-dom";
import "./adminhome.css";
import AboutUs from "./aboutus";

import Navbar from "./navbar";

const AdminHome = () => {
  const cards = [
    {
      title: "Manage Rooms",
      desc: "Add, update or delete room details.",
      link: "/room_details",
    },
    {
      title: "Manage Owners",
      desc: "Approve, update or remove owners.",
      link: "/owner_details",
    },
    {
      title: "Manage Tenants",
      desc: "View and control tenant accounts.",
      link: "/tenants_details",
    },
  ];

  return (
    <div className="admin-container">
      <Navbar />

      <div className="admin-content">
        <h1>Admin Dashboard</h1>

        <div className="admin-card-grid">
          {cards.map((card, index) => (
            <div className="admin-card" key={index}>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>

              <Link to={card.link} className="admin-btn">
                Manage
              </Link>
            </div>
          ))}
        </div>
      </div>
      
       <AboutUs />
     
    </div>
  );
};

export default AdminHome;