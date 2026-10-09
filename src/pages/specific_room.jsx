import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import './specific_room.css';
import Navbar from './navbar';

const Specific_Room = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    axios.get(`http://localhost:8080/api/rooms/${id}`)
      .then(res => {
        console.log("Room Details Received:", res.data); 
        setRoom(res.data);
      })
      .catch(err => {
        console.error("Error fetching room:", err);
      });
  }, [id]);

  const handleBooking = async () => {
    if (!userId) {
      alert("Please login first to book a room!");
      navigate('/login');
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/customers/${userId}/book/${id}`);
      alert("Success! Room has been added to your bookings.");
      navigate('/myroom');
    } catch (err) {
      console.error("Booking Error:", err);
      alert("Failed to book the room.");
    }
  };

  if (!room) return <div className="loader">Loading property details...</div>;

  return (
    <>
    <Navbar />
    <div className="room-container">
      <div className="main-content">
        <div className="image-section">
          <img 
            src={room.image || 'https://via.placeholder.com/600x400'} 
            alt="Room View" 
            className="room-image" 
          />
        </div>

        <div className="details-section">
          <h2 className="section-title">Property Specifications</h2>
          
          <div className="info-group">
            <label>Location:</label>
            <input type="text" value={room.location || ""} readOnly />
          </div>

          <div className="info-grid">
            <div className="info-group">
              <label>Monthly Rent:</label>
              <input type="text" value={`₹${room.rent}`} readOnly />
            </div>
            <div className="info-group">
              <label>Security Deposit:</label>
              <input type="text" value={`₹${room.deposit}`} readOnly />
            </div>
          </div>

          <div className="info-group">
            <label>Room Owner:</label>
            <input 
              type="text" 
              style={{ fontWeight: "bold", color: "#2c3e50" }}
              value={room.owner?.name || "Owner details not available"} 
              readOnly 
            />
          </div>

          <div className="info-group">
            <label>About this Place:</label>
            <textarea value={room.description || "No description available."} readOnly />
          </div>

          <div className="info-grid">
             <div className="info-group">
              <label>Type:</label>
              <input type="text" value={room.roomType || ""} readOnly />
            </div>
            <div className="info-group">
              <label>Available Units:</label>
              <input type="text" value={room.noOfRooms || "0"} readOnly />
            </div>
          </div>

          <div className="button-group">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <i className="fa fa-arrow-left"></i> Back
            </button>
            
            {room.noOfRooms > 0 ? (
              <button className="book-btn" onClick={handleBooking}>
                CONFIRM BOOKING
              </button>
            ) : (
              <button className="book-btn disabled" disabled style={{backgroundColor: 'gray'}}>
                SOLD OUT
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Specific_Room;