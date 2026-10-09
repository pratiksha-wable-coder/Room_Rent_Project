import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./navbar.css";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSignOut = () => {
    try {
      if(window.confirm("Are you sure you want to sign out?")) {
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("token"); 
        navigate("/login");
        alert("You have been signed out successfully.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to sign out properly.");
    }
  };

  const handleHomeClick = (path) => {
    if (location.pathname !== path) {
      navigate(path);
      setTimeout(scrollToTop, 150);
    } else {
      scrollToTop();
    }
  };

  const handleAboutClick = (path) => {
    if (location.pathname !== path) {
      navigate(path);
      setTimeout(() => {
        const section = document.getElementById("about-section");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    } else {
      const section = document.getElementById("about-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-logo">
          Room Rental Management System
        </div>

        <ul className="navbar-menu">
          {(role === "TENANT" || role === "CUSTOMER") && (
            <>
              <li>
                <button className="nav-link-btn" onClick={() => handleHomeClick("/tenanthome")}>
                  Home
                </button>
              </li>
              <li><Link to="/room_details">Find Room</Link></li>
              <li><Link to="/myroom">My Room</Link></li>
              <li>
                <button className="nav-link-btn" onClick={() => handleAboutClick("/tenanthome")}>
                  About Us
                </button>
              </li>
            </>
          )}

          {role === "OWNER" && (
            <>
              <li>
                <button className="nav-link-btn" onClick={() => handleHomeClick("/ownerhome")}>
                  Home
                </button>
              </li>
              <li><Link to="/add_room">Add Room</Link></li>
              <li><Link to="/my_properties">My Properties</Link></li>
              <li>
                <button className="nav-link-btn" onClick={() => handleAboutClick("/ownerhome")}>
                  About Us
                </button>
              </li>
            </>
          )}

          {role === "ADMIN" && (
            <>
              <li>
                <button className="nav-link-btn" onClick={() => handleHomeClick("/adminhome")}>
                  Home
                </button>
              </li>
              <li><Link to="/tenants_details">Manage Users</Link></li>
              <li><Link to="/owner_details">Manage Owners</Link></li>
              <li><Link to="/room_details">Manage Rooms</Link></li>
              <li><Link to="/all_booking">All Bookings</Link></li>
              <li><Link to="/add_room">Add Room</Link></li>
              <li>
                <button className="nav-link-btn" onClick={() => handleAboutClick("/adminhome")}>
                  About Us
                </button>
              </li>
            </>
          )}
        </ul>

        <button className="logout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;