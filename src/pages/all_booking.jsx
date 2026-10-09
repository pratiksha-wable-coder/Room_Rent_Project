import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./navbar";
import "./all_booking.css";

const All_Booking = () => {
  const [rooms, setRooms] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null); 
  const [showEditModal, setShowEditModal] = useState(false); 

  const adminId = localStorage.getItem('userId'); 
  const userRole = localStorage.getItem('role'); 

  const fetchRooms = () => {
    axios
      .get(`http://localhost:8080/api/rooms/all`)
      .then((res) => setRooms(res.data))
      .catch((err) => console.error("Error fetching rooms:", err));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (id) => {
    if (userRole !== 'ADMIN') {
      alert("Only Admin can delete bookings!");
      return;
    }

    if (window.confirm("Are you sure you want to delete this? This will update Admin DB too.")) {
      try {
        // १. Admin DB Sync
        await axios.delete(`http://localhost:8080/api/admins/${adminId}/remove-booking/${id}`);
        
        // २. Main Room Delete
        await axios.delete(`http://localhost:8080/api/rooms/${id}`);
        
        alert("Deleted Successfully! 🗑️");
        fetchRooms();
      } catch (err) {
        console.error("Delete error:", err);
        alert("Delete failed.");
      }
    }
  };

  const openEditForm = (room) => {
    if (userRole !== 'ADMIN') {
        alert("Only Admin can edit bookings!");
        return;
    }
    setEditingBooking({ ...room }); 
    setShowEditModal(true); 
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const roomId = editingBooking.id || editingBooking._id;

    if (!roomId) {
        alert("Error: Room ID not found!");
        return;
    }

    try {
      await axios.put(`http://localhost:8080/api/rooms/update/${roomId}`, editingBooking);
      alert("Updated Successfully in Database! ✅");
      setShowEditModal(false); 
      fetchRooms(); 
    } catch (err) {
      console.error("Update error:", err.response?.data);
      alert("Update failed. Check backend console.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="properties-page">
        <div className="overlay-bg">
          <div className="content-container">
            <h2 className="page-title">All Bookings (Rooms)</h2>

            <div className="property-grid">
              {rooms.map((room) => (
                <div key={room.id || room._id} className="property-card">
                  <div className="card-image">
                    <img src={room.image || "placeholder.jpg"} alt="Room" />
                  </div>
                  <div className="card-details">
                    <h3>{room.location}</h3>
                    <p className="details">Rent: ₹{room.rent}</p>
                    <p className="details">Rooms Available: {room.noOfRooms}</p>
                    <div className="room-footer">
                      <button className="delete-btn" onClick={() => handleDelete(room.id || room._id)}>Delete</button>
                      <button className="update-btn" onClick={() => openEditForm(room)}>Edit</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showEditModal && (
          <div className="modal-overlay">
            <div className="edit-form-container">
              <h3>Edit Room Details</h3>
              <form onSubmit={handleUpdate}>
                <label>Location:</label>
                <input 
                  type="text" 
                  value={editingBooking.location} 
                  onChange={(e) => setEditingBooking({...editingBooking, location: e.target.value})} 
                />
                
                <label>Rent:</label>
                <input 
                  type="number" 
                  value={editingBooking.rent} 
                  onChange={(e) => setEditingBooking({...editingBooking, rent: e.target.value})} 
                />

                <label>Rooms Available:</label>
                <input 
                  type="number" 
                  value={editingBooking.noOfRooms} 
                  onChange={(e) => setEditingBooking({...editingBooking, noOfRooms: e.target.value})} 
                />

                <div className="form-actions">
                  <button type="submit" className="save-btn">Update</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default All_Booking;