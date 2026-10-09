
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./navbar";
import "./my_properties.css";

const MyProperties = () => {
  const [myRooms, setMyRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null); 
  const [formData, setFormData] = useState({}); 
  const ownerId = localStorage.getItem("userId");

  const fetchOwnerRooms = () => {
    if (ownerId) {
      axios
        .get(`http://localhost:8080/api/rooms/owner/${ownerId}`)
        .then((res) => setMyRooms(res.data))
        .catch((err) => console.error("Error fetching properties:", err));
    }
  };

  useEffect(() => {
    
    fetchOwnerRooms();
  }, [ownerId]);

  const openEditForm = (room) => {
    setEditingRoom(room.id);
    setFormData(room); //store room data in form
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/rooms/update/${editingRoom}`, formData);
      alert("Property Updated Successfully!");
      setEditingRoom(null); 
      fetchOwnerRooms(); 
    } catch (err) {
      alert("Update Failed!");
    }
  };

  const handleDelete = async (roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axios.delete(`http://localhost:8080/api/rooms/${roomId}`);
        setMyRooms(myRooms.filter((room) => room.id !== roomId));
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: 'white' }} className="properties-page">
        <div className="overlay-bg">
          <div className="content-container">
            <h2 className="page-title">My Properties</h2>

            {/* --- EDIT FORM (MODAL) --- */}
            {editingRoom && (
              <div className="edit-modal">
                <form className="edit-form" onSubmit={handleUpdateSubmit}>
                  <h3>Update Property Details</h3>
                  <label>Rent:</label>
                  <input type="number" name="rent" value={formData.rent} onChange={handleInputChange} required />
                  
                  <label>Total Rooms:</label>
                  <input type="number" name="noOfRooms" value={formData.noOfRooms} onChange={handleInputChange} required />
                  
                  <label>Deposit:</label>
                  <input type="number" name="deposit" value={formData.deposit} onChange={handleInputChange} required />
                  
                  <label>Description:</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange}></textarea>

                  <div className="modal-buttons">
                    <button type="submit" className="save-btn">Save Changes</button>
                    <button type="button" className="cancel-btn" onClick={() => setEditingRoom(null)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="property-grid">
              {myRooms.map((room) => (
                <div key={room.id} className="property-card">
                  <div className="card-image">
                    {room.image ? <img src={room.image} alt="Room" /> : <div className="image-placeholder">No Image</div>}
                    <div className="price-tag">₹{room.rent}</div>
                  </div>
                  <div className="card-details">
                    <h3 className="room-title">Owner: {room.owner?.name}</h3>
                    <h3 className="room-title1">{room.roomType} - {room.location}</h3>
                    <h3 className="room-title1">{room.furnishing} Furnished</h3>
                    <h3 className="room-title1">{room.waterSupply} Water</h3>

                    <h3 className="room-title1">Rooms Left: {room.noOfRooms}</h3>
                    <div className="room-footer">
                      <button className="delete-btn" onClick={() => handleDelete(room.id)}>Delete</button>
                      <button className="update-btn" onClick={() => openEditForm(room)}>Edit</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProperties;
