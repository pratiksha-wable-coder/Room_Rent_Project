import React from 'react';
import './my_room.css';
import room from './room3.png';
import Navbar from './navbar';


const My_Room = ({ roomData }) => {
  const data = roomData || {
    title: "My Room",
    rent: "$1,200 / month",
    location: "Downtown, New York",
    description: "A cozy, well-lit room with a great view of the city skyline."
  };

  return (
    <>
    <Navbar />
    <div className="card-container">
      <div className="room-card">
        <h2 className="room-title">{data.title}</h2>
        
        <div className="image-placeholder">
            <img
                    src={room}
                    alt={"image"}
                    className="room-thumb"
                  />
          <span className="img-text"></span>
        </div>

        <div className="info-section">
          <div className="info-group">
            <label>Rent:</label>
            <div className="input-box">{data.rent}</div>
          </div>

          <div className="info-group">
            <label>Location:</label>
            <div className="input-box">{data.location}</div>
          </div>

          <div className="info-group">
            <label>Description:</label>
            <div className="input-box description-box">{data.description}</div>
          </div>
        </div>

        <div className="button-group">
          <button className="btn btn-back">Back</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default My_Room;
