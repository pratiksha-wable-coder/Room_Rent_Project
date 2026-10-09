import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SpecificRoom.css';
import Navbar from './navbar';

const SpecificRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);

    useEffect(() => {
        if (id && id !== 'undefined') {
            axios.get(`http://localhost:8080/api/rooms/${id}`)
                .then(res => setRoom(res.data))
                .catch(err => {
                    console.error("Error fetching room details:", err);
                    setRoom(null); 
                });
        }
    }, [id]);

    const handleBooking = async () => {
        const roomId = room?._id || room?.id || id;
        const userId = localStorage.getItem('userId'); 
        const fullUser = JSON.parse(localStorage.getItem('user')); 
        
        const userRole = fullUser?.role || localStorage.getItem('userRole');

        if (!userId || !fullUser || roomId === 'undefined') {
            alert("Session error. Please login again.");
            return;
        }

        if (!window.confirm("Confirm Booking?")) return;

        try {
            await axios.post(`http://localhost:8080/api/rooms/book/${roomId}`);
            
            if (userRole === 'ADMIN') {
                await axios.post(`http://localhost:8080/api/admins/${userId}/add-booked-room/${roomId}`);
            } else {
                await axios.put(`http://localhost:8080/api/customers/${userId}/book/${roomId}`);
            }

            const depositData = {
                customerId: userId,
                customer: fullUser,       
                owner: room.owner,        
                roomNo: room.noOfRooms || room.roomNo, 
                location: room.location,
                rent: room.rent,
                depositAmount: Number(room.rent * 2),
                paymentDate: new Date().toLocaleString(),
                depositId: "DEP" + Math.floor(1000 + Math.random() * 9000) 
            };

            await axios.post(`http://localhost:8080/api/deposits/add`, depositData);
            
            alert("Booking Successful! ✅");
            navigate('/deposite_details1');

        } catch (error) {
            console.error("Booking API Error:", error.response);
            alert("Booking Failed! Please check if backend is running.");
        }
    };

    if (!room) return <div className="loader">Loading Property Details...</div>;

    return (
        <>
            <Navbar/>
            <div className="sr-wrapper">
                <div className="sr-main-container">
                    <div className="sr-image-top">
                        <img src={room.image} alt="Property" className="sr-full-image" />
                    </div>
                    <div className="sr-content-bottom">
                        <div className="sr-header-info">
                            <h1 className="sr-title">{room.location}</h1>
                            <p className="sr-category">{room.roomType} | {room.noOfRooms} Rooms Available</p>
                        </div>
                        <div className="sr-price-section">
                            <span className="sr-label">Monthly Rent:</span>
                            <span className="sr-value">₹{room.rent}</span>
                        </div>
                        <div className="sr-specs-container">
                            <div className="sr-spec-box">
                                <span className="sr-spec-label">Security Deposit</span>
                                <span className="sr-spec-value">₹{room.deposit || (room.rent * 2)}</span>
                            </div>
                            <div className="sr-spec-box">
                                <span className="sr-spec-label">Furnishing Status</span>
                                <span className="sr-spec-value">{room.furnishing}</span>
                            </div>
                            <div className="sr-spec-box">
                                <span className="sr-spec-label">Water Supply</span>
                                <span className="sr-spec-value">{room.waterSupply}</span>
                            </div>
                        </div>
                        <div className="sr-desc-section">
                            <h3>About this property</h3>
                            <p>{room.description}</p>
                        </div>
                        <div className="sr-owner-card-simple">
                            <h3>Owner Information</h3>
                            <div className="sr-owner-grid">
                                <p><strong>Name:</strong> {room.owner?.name || "N/A"}</p>
                                <p className="sr-phone-red"><strong>Contact:</strong> {room.owner?.contact || "N/A"}</p>
                            </div>
                        </div>
                        <div className="sr-action-buttons">
                            <button className="sr-book-btn" onClick={handleBooking}>Book This Room Now</button>
                            <button className="sr-cancel-btn" onClick={() => navigate('/room_details')}>Go Back</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SpecificRoom;