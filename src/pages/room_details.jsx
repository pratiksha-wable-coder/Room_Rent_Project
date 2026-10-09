import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './room_details.css';
import Navbar from './navbar';
import { Link } from 'react-router-dom';

const Room_Details = () => {
  const [roomData, setRoomData] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = () => {
    axios.get('http://localhost:8080/api/rooms/all')
      .then(res => setRoomData(res.data))
      .catch(err => console.error(err));
  };

  const handleNotAvailable = () => {
    alert("Sorry! This is not available right now.");
  };

  return (
    <>
      <Navbar />
      <div className="details-container">
        <header className="details-header">
          <h1>Explore Available Rooms</h1>
        </header>
        <div className="room-grid">
          {roomData.map((room) => (
            <div className="room-card" key={room.id}>
              <div className="image-container">
                <img src={room.image} alt="Room" className="card-img" />
                <span className="price-tag">₹{room.rent}/mo</span>
                
                <span className={`status-badge ${room.noOfRooms > 0 ? 'available' : 'out-of-stock'}`}>
                  {room.noOfRooms > 0 ? `${room.noOfRooms} Rooms Left` : 'Out of Stock'}
                </span>
              </div>
              
              <div className="card-content">
                <h3 className="room-location"><i className="fa fa-map-marker"></i> {room.location}</h3>
                <div className="info-row">
                  <span><i className="fa fa-home"></i> {room.roomType}</span>
                  <span><i className="fa fa-bed"></i> {room.noOfRooms > 0 ? room.noOfRooms : 0} Available</span>
                </div>
                
                <div className="specs">
                  <p><strong>Deposit:</strong> ₹{room.deposit}</p>
                  <p><strong>Furnishing:</strong> {room.furnishing}</p>
                  <p><strong>Water:</strong> {room.waterSupply}</p>
                </div>

                <div className="owner-box">
                  <p className="owner-name">
                    Owner: {room.owner ? room.owner.name : "Not Specified"}
                  </p>
                  
                  {room.noOfRooms > 0 ? (
                    <Link 
                      to={`/room/${room.id}`} 
                      className="contact-btn"
                    >
                      <i className="fa fa-info-circle"></i> View Details & Contact
                    </Link>
                  ) : (
                    <button className="contact-btn unavailable-btn" onClick={handleNotAvailable}>
                      <i className="fa fa-times-circle"></i> Not Available
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Room_Details;