import React from "react";
import { useNavigate } from "react-router-dom";
import "./roomdetails.css";
import roomimage1 from "./roomdetails1.png";
import roomimage2 from "./roomdetails2.png";

const RoomDetails = () => {
  const navigate = useNavigate();

  const roomData = [
    {
      oid: "101",
      rNo: "A-12",
      location: "Downtown, NY",
      rent: "$1,200",
      rooms: 3,
      image: roomimage1,
      description: "Spacious studio with great lighting."
    },
    {
      oid: "102",
      rNo: "B-05",
      location: "Brooklyn, NY",
      rent: "$950",
      rooms: 2,
      image: roomimage2,
      description: "Comfortable room near subway."
    },
    {
      oid: "103",
      rNo: "C-07",
      location: "Queens, NY",
      rent: "$1,050",
      rooms: 2,
      image: roomimage1,
      description: "Well-ventilated apartment."
    },
    {
      oid: "104",
      rNo: "D-02",
      location: "Bronx, NY",
      rent: "$900",
      rooms: 1,
      image: roomimage2,
      description: "Affordable single room."
    }
  ];

  const handleClick = (room) => {
    navigate("/specific_room", { state: room });
  };

  return (
    <div className="container">
      <h1>Room Listings</h1>

      <table>
        <thead>
          <tr>
            <th>OID</th>
            <th>R No</th>
            <th>Location</th>
            <th>Rent</th>
            <th>Room Preview</th>
            <th>No. of Rooms</th>
          </tr>
        </thead>

        <tbody>
          {roomData.map((room) => (
            <tr key={room.oid}>
              <td>{room.oid}</td>
              <td>{room.rNo}</td>
              <td>{room.location}</td>
              <td>{room.rent}</td>

              <td>
                <img
                  src={room.image}
                  alt="room"
                  className="room-thumb"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleClick(room)}
                />
              </td>

              <td>{room.rooms}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomDetails;
