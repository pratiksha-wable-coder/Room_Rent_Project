import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MyRoom.css';
import Navbar from './navbar';

const MyRoom = () => {
    const [bookedRooms, setBookedRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    const [customerName, setCustomerName] = useState("");
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchMyRoom();
    }, [userId]);

    const fetchMyRoom = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get(`http://localhost:8080/api/customers/${userId}`);
            if (response.data) {
                setBookedRooms(response.data.bookedRooms || []);
                setCustomerName(response.data.name || "Tenant"); 
            }
        } catch (error) {
            console.error("Error fetching booked rooms:", error);
        } finally {
            setLoading(false);
        }
    };
  const handleCancel = async (roomId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            await axios.put(`http://localhost:8080/api/customers/${userId}/cancel-booking/${roomId}`);
            
            alert("Booking Cancelled Successfully! ❌");
            
            fetchMyRoom();
        } catch (error) {
            console.error("Cancel Booking Error:", error);
            alert("Failed to cancel booking.");
        }
    };
    

    if (loading) return <div className="loader-container">Loading your room details...</div>;

    return (
        <>
        <Navbar />
        <div className="mr-wrapper">
            <div className="mr-container">
                <h2 className="mr-title">🏠 My Booked Rooms</h2>
                
                {bookedRooms.length > 0 ? (
                    bookedRooms.map((room, index) => (
                        <div className="mr-card" key={index} style={{ marginBottom: "20px" }}>
                            <div className="mr-image-section">
                                <img 
                                    src={room.image || 'https://via.placeholder.com/400x250'} 
                                    alt="Booked Room" 
                                    className="mr-room-img"
                                />
                                <div className="mr-status-badge">Booked</div>
                            </div>

                            <div className="mr-info-section">
                                <h3 className="mr-room-name">{room.location}</h3>
                                
                                <h4 className="mr-tenant-name">
                                    Tenant: <span className="tenant-highlight">{customerName}</span>
                                </h4>
                                
                                <p className="mr-description">{room.description}</p>
                                
                                <div className="mr-details-grid">
                                    <div className="mr-detail-item">
                                        <span className="mr-label">Rent:</span>
                                        <span className="mr-value">₹{room.rent} / month</span>
                                    </div>
                                    <div className="mr-detail-item">
                                        <span className="mr-label">Owner:</span>
                                        <span className="mr-value">{room.owner ? room.owner.name : "N/A"}</span>
                                    </div>
                                </div>
<div className="mr-actions" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                    {/* ✅ १. Deposit Details Button */}
                                    <button className="mr-btn mr-btn-primary" onClick={() => navigate('/deposite_details')}>
                                        Deposit Details
                                    </button>

                                    {/* ✅ २. Cancel Booking Button */}
                                    <button 
                                        className="mr-btn mr-btn-danger" 
                                        style={{ backgroundColor: '#ff3939', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}
                                        onClick={() => handleCancel(room._id || room.id)}
                                    >
                                        Cancel Booking
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )  : (
                    <div className="mr-empty-state">
                        <p>You haven't booked any room yet.</p>
                        <button className="mr-btn mr-btn-primary" onClick={() => navigate('/tenanthome')}>
                            Explore Rooms
                        </button>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default MyRoom;